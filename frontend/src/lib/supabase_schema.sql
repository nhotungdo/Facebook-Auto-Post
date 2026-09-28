-- ==========================================
-- AI SOCIAL MEDIA AGENT - SUPABASE SCHEMA
-- ==========================================

-- 1. Bật extension pgvector để dùng cho AI Brand Memory
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Bảng Profiles (Liên kết với hệ thống Auth mặc định của Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security (RLS) cho profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

-- 3. Bảng Workspaces (Multi-tenant: mỗi user có ít nhất một workspace)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view member workspaces" ON workspaces
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspaces.id AND m.user_id = (select auth.uid())
    )
  );
CREATE POLICY "Users can create workspaces" ON workspaces
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Members can update workspaces" ON workspaces
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspaces.id AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspaces.id AND m.user_id = (select auth.uid())
    )
  );

-- 4. Bảng Workspace Members (Phân quyền trong workspace)
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view workspace members" ON workspace_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspace_members.workspace_id AND m.user_id = (select auth.uid())
    )
  );
-- User tự thêm chính mình vào workspace (dùng khi tạo workspace mới)
CREATE POLICY "Users can add self to workspace" ON workspace_members
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can remove self from workspace" ON workspace_members
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- 5. Bảng AI Settings (Lưu cấu hình API Key)
CREATE TABLE ai_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  groq_api_key TEXT,
  default_model TEXT DEFAULT 'llama3-70b-8192',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own AI settings" ON ai_settings FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- 6. Bảng AI Generations (Theo dõi token usage của AI)
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'post',
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own AI generations" ON ai_generations FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- 7. Bảng Facebook Pages (Lưu Fanpage đã kết nối)
CREATE TABLE facebook_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL, -- Trang thuộc workspace nào
  page_id TEXT NOT NULL, -- ID của page trên Facebook
  page_name TEXT NOT NULL,
  access_token TEXT NOT NULL, -- Cần mã hóa ở Backend trước khi lưu
  picture_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_id)
);
ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own pages" ON facebook_pages FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- 8. Bảng Posts (Gộp Bài viết và Lịch đăng)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL, -- Bài viết thuộc workspace nào
  page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,

  -- AI Configuration (Đầu vào)
  goal TEXT,
  tone TEXT,

  -- Content (Đầu ra)
  content TEXT,
  media_urls TEXT[], -- Danh sách link ảnh/video

  -- Trạng thái và Lên lịch
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'published', 'failed')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  facebook_post_id TEXT, -- ID trả về từ Meta API sau khi đăng thành công
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own posts" ON posts FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- 9. Bảng Post Logs (Lưu lịch sử hệ thống đăng bài)
CREATE TABLE post_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE post_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON post_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_logs.post_id AND posts.user_id = (select auth.uid()))
);

-- 10. Bảng Brand Knowledge (Vector DB cho AI nhớ thông tin thương hiệu)
CREATE TABLE brand_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- Dimension của model text-embedding-3-small
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE brand_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own brand knowledge" ON brand_knowledge FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- Function hỗ trợ vector search
CREATE OR REPLACE FUNCTION match_brand_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    brand_knowledge.id,
    brand_knowledge.content,
    1 - (brand_knowledge.embedding <=> query_embedding) AS similarity
  FROM brand_knowledge
  WHERE brand_knowledge.user_id = p_user_id
    AND 1 - (brand_knowledge.embedding <=> query_embedding) > match_threshold
  ORDER BY brand_knowledge.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 11. Indexes cho các query phổ biến
CREATE INDEX IF NOT EXISTS idx_posts_workspace_id ON posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_status ON posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at) WHERE status = 'ready';
CREATE INDEX IF NOT EXISTS idx_facebook_pages_workspace_id ON facebook_pages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);

-- 12. Trigger tự động tạo profile + workspace mặc định khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- Tự động tạo workspace mặc định để frontend useWorkspace luôn tìm thấy
  INSERT INTO public.workspaces (name, created_by)
  VALUES ('My Workspace', new.id)
  RETURNING id INTO new_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, new.id, 'owner');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
