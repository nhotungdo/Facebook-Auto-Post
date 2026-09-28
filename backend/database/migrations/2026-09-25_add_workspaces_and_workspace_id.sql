-- ============================================================
-- MIGRATION: Add workspaces + workspace_id columns (idempotent)
-- Chạy được nhiều lần mà không lỗi. Dùng cho DB đã có schema cũ.
-- ============================================================

-- 1. Bảng workspaces (bắt buộc tạo trước vì là FK target)
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng workspace_members
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- 3. Thêm cột workspace_id (không NOT NULL để không fail với row cũ)
ALTER TABLE facebook_pages
  ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;

-- 4. Bảng ai_generations (tracking token usage mà backend posts.py insert vào)
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'post',
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bật RLS cho các bảng mới
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- 6. Policies (DROP IF EXISTS + CREATE để chạy lại không lỗi)
DROP POLICY IF EXISTS "Users can view member workspaces" ON workspaces;
CREATE POLICY "Users can view member workspaces" ON workspaces
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspaces.id AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
CREATE POLICY "Users can create workspaces" ON workspaces
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Members can update workspaces" ON workspaces;
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

DROP POLICY IF EXISTS "Members can view workspace members" ON workspace_members;
CREATE POLICY "Members can view workspace members" ON workspace_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members m
      WHERE m.workspace_id = workspace_members.workspace_id AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can add self to workspace" ON workspace_members;
CREATE POLICY "Users can add self to workspace" ON workspace_members
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can remove self from workspace" ON workspace_members;
CREATE POLICY "Users can remove self from workspace" ON workspace_members
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own AI generations" ON ai_generations;
CREATE POLICY "Users can manage own AI generations" ON ai_generations
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 7. Trigger tự tạo profile + workspace mặc định cho user mới
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

-- 8. Backfill: tạo workspace mặc định cho user ĐÃ tồn tại (chưa có workspace nào)
DO $$
DECLARE
  u RECORD;
  ws_id UUID;
BEGIN
  FOR u IN SELECT id FROM profiles
  LOOP
    IF NOT EXISTS (SELECT 1 FROM workspace_members WHERE user_id = u.id) THEN
      INSERT INTO workspaces (name, created_by)
      VALUES ('My Workspace', u.id)
      RETURNING id INTO ws_id;

      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES (ws_id, u.id, 'owner');
    END IF;
  END LOOP;
END $$;

-- 9. Backfill: gán workspace_id cho pages/posts cũ theo workspace đầu tiên của user
UPDATE facebook_pages fp
SET workspace_id = m.workspace_id
FROM workspace_members m
WHERE fp.user_id = m.user_id AND fp.workspace_id IS NULL;

UPDATE posts p
SET workspace_id = m.workspace_id
FROM workspace_members m
WHERE p.user_id = m.user_id AND p.workspace_id IS NULL;

-- 10. Indexes cho các query phổ biến
CREATE INDEX IF NOT EXISTS idx_posts_workspace_id ON posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_status ON posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at) WHERE status = 'ready';
CREATE INDEX IF NOT EXISTS idx_facebook_pages_workspace_id ON facebook_pages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
