-- PersonaLink Supabase数据库初始化脚本
-- 在Supabase Dashboard > SQL Editor 中执行此脚本

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  avatar TEXT,
  class_id TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user',
  profile JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 班级表
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  teacher TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 同义词组表
CREATE TABLE IF NOT EXISTS synonym_groups (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT DEFAULT '未分类',
  synonyms JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认系统管理员账号
INSERT INTO users (id, name, email, password, avatar, is_admin, role, profile, created_at, updated_at)
VALUES (
  'admin-system-001',
  '系统管理员',
  'admin@system.com',
  'admin123',
  'https://picsum.photos/seed/admin-system/200/200',
  TRUE,
  'admin',
  '{"name": "系统管理员", "hometown": "", "phone": "", "hobbies": [], "bio": ""}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 关闭Row Level Security（简单部署，使用service_role key访问）
-- 注意：生产环境建议启用RLS并配置适当策略
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE synonym_groups DISABLE ROW LEVEL SECURITY;
