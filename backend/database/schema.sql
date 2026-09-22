-- SocialPilot AI Database Schema (PostgreSQL for Supabase)

-- 1. Core SaaS Tables
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, editor, viewer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- 2. Social Accounts
CREATE TABLE facebook_pages (
    id VARCHAR(255) PRIMARY KEY, -- Facebook Page ID
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL, -- Should be encrypted
    followers_count INT DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Content & AI
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    page_id VARCHAR(255) REFERENCES facebook_pages(id) ON DELETE SET NULL,
    title VARCHAR(255),
    content TEXT,
    status VARCHAR(50) CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled')) DEFAULT 'draft',
    media_url TEXT,
    post_type VARCHAR(50) DEFAULT 'text',
    tone VARCHAR(100),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    facebook_post_id VARCHAR(255),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(100), -- 'post', 'strategy', 'ideas', etc.
    provider VARCHAR(50) DEFAULT 'groq',
    model VARCHAR(100),
    prompt TEXT,
    response TEXT,
    tokens_input INT DEFAULT 0,
    tokens_output INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic workspace isolation)
-- Example: Users can only see workspaces they are members of
CREATE POLICY "Users can view their workspaces" ON workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_members.workspace_id = workspaces.id 
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Similar policies should be added for other tables based on workspace_id
CREATE POLICY "Users can access workspace facebook_pages" ON facebook_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_members.workspace_id = facebook_pages.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access workspace posts" ON posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_members.workspace_id = posts.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access workspace ai_generations" ON ai_generations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_members.workspace_id = ai_generations.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );
