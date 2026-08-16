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
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Bảng AI Settings (Lưu cấu hình API Key)
CREATE TABLE ai_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  openai_api_key TEXT,
  default_model TEXT DEFAULT 'gpt-4o',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own AI settings" ON ai_settings FOR ALL USING (auth.uid() = user_id);

-- 4. Bảng Facebook Pages (Lưu Fanpage đã kết nối)
CREATE TABLE facebook_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  page_id TEXT NOT NULL, -- ID của page trên Facebook
  page_name TEXT NOT NULL,
  access_token TEXT NOT NULL, -- Cần mã hóa ở Backend trước khi lưu
  picture_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_id)
);
ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own pages" ON facebook_pages FOR ALL USING (auth.uid() = user_id);

-- 5. Bảng Posts (Gộp Bài viết và Lịch đăng)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
CREATE POLICY "Users can manage own posts" ON posts FOR ALL USING (auth.uid() = user_id);

-- 6. Bảng Post Logs (Lưu lịch sử hệ thống đăng bài)
CREATE TABLE post_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE post_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON post_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_logs.post_id AND posts.user_id = auth.uid())
);

-- 7. Bảng Brand Knowledge (Vector DB cho AI nhớ thông tin thương hiệu)
CREATE TABLE brand_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL, 
  embedding vector(1536), -- Dimension của model text-embedding-3-small
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE brand_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own brand knowledge" ON brand_knowledge FOR ALL USING (auth.uid() = user_id);

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
