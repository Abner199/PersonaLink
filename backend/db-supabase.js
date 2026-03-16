/**
 * Supabase数据库适配器
 * 实现与本地db.js相同的connectDB()接口，但使用Supabase云数据库
 */
const { createClient } = require('@supabase/supabase-js');

let _client = null;

const getClient = () => {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return _client;
};

const connectDB = async () => {
  const client = getClient();

  const [
    { data: usersRaw, error: e1 },
    { data: classesRaw, error: e2 },
    { data: synonymGroupsRaw, error: e3 }
  ] = await Promise.all([
    client.from('users').select('*'),
    client.from('classes').select('*'),
    client.from('synonym_groups').select('*')
  ]);

  if (e1) throw new Error(`加载用户失败: ${e1.message}`);
  if (e2) throw new Error(`加载班级失败: ${e2.message}`);
  if (e3) throw new Error(`加载同义词失败: ${e3.message}`);

  // Map DB snake_case columns → JS camelCase fields
  const mapUser = (r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    password: r.password,
    avatar: r.avatar,
    classId: r.class_id,
    isAdmin: r.is_admin || false,
    role: r.role || 'user',
    profile: r.profile || { name: '', hometown: '', phone: '', hobbies: [], bio: '' },
    createdAt: r.created_at,
    updatedAt: r.updated_at
  });

  const mapClass = (r) => ({
    id: r.id,
    name: r.name,
    description: r.description || '',
    teacher: r.teacher || '',
    createdAt: r.created_at
  });

  const mapSynonymGroup = (r) => ({
    id: r.id,
    name: r.name,
    category: r.category || '未分类',
    synonyms: r.synonyms || []
  });

  // Track original IDs to detect deletions on write
  const originalUserIds = new Set((usersRaw || []).map((r) => r.id));
  const originalClassIds = new Set((classesRaw || []).map((r) => r.id));
  const originalSgIds = new Set((synonymGroupsRaw || []).map((r) => r.id));

  const data = {
    users: (usersRaw || []).map(mapUser),
    classes: (classesRaw || []).map(mapClass),
    synonymGroups: (synonymGroupsRaw || []).map(mapSynonymGroup)
  };

  return {
    data,
    write: async () => {
      const client = getClient();

      // --- Users ---
      if (data.users.length > 0) {
        const rows = data.users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
          avatar: u.avatar,
          class_id: u.classId || null,
          is_admin: u.isAdmin || false,
          role: u.role || 'user',
          profile: u.profile || {},
          created_at: u.createdAt,
          updated_at: u.updatedAt
        }));
        const { error } = await client.from('users').upsert(rows);
        if (error) throw new Error(`写入用户失败: ${error.message}`);
      }
      const currentUserIds = new Set(data.users.map((u) => u.id));
      const deletedUserIds = [...originalUserIds].filter((id) => !currentUserIds.has(id));
      if (deletedUserIds.length > 0) {
        const { error } = await client.from('users').delete().in('id', deletedUserIds);
        if (error) throw new Error(`删除用户失败: ${error.message}`);
      }

      // --- Classes ---
      if (data.classes.length > 0) {
        const rows = data.classes.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          teacher: c.teacher || ''
        }));
        const { error } = await client.from('classes').upsert(rows);
        if (error) throw new Error(`写入班级失败: ${error.message}`);
      }
      const currentClassIds = new Set(data.classes.map((c) => c.id));
      const deletedClassIds = [...originalClassIds].filter((id) => !currentClassIds.has(id));
      if (deletedClassIds.length > 0) {
        const { error } = await client.from('classes').delete().in('id', deletedClassIds);
        if (error) throw new Error(`删除班级失败: ${error.message}`);
      }

      // --- Synonym Groups ---
      if (data.synonymGroups.length > 0) {
        const rows = data.synonymGroups.map((sg) => ({
          id: sg.id,
          name: sg.name,
          category: sg.category || '未分类',
          synonyms: sg.synonyms || []
        }));
        const { error } = await client.from('synonym_groups').upsert(rows);
        if (error) throw new Error(`写入同义词失败: ${error.message}`);
      }
      const currentSgIds = new Set(data.synonymGroups.map((sg) => sg.id));
      const deletedSgIds = [...originalSgIds].filter((id) => !currentSgIds.has(id));
      if (deletedSgIds.length > 0) {
        const { error } = await client.from('synonym_groups').delete().in('id', deletedSgIds);
        if (error) throw new Error(`删除同义词失败: ${error.message}`);
      }
    }
  };
};

module.exports = { connectDB };
