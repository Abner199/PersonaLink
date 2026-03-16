// 静态引入两个实现，让Netlify打包器能正确包含db-supabase.js
const supabaseDB = require('./db-supabase');

// 当设置了SUPABASE_URL时使用Supabase云数据库（Netlify部署），否则使用本地JSON文件
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  module.exports = supabaseDB;
} else {
  // 本地开发：使用文件型JSON数据库
  const fs = require('fs');
  const path = require('path');

  const dbPath = path.join(__dirname, 'db.json');

  const connectDB = async () => {
    try {
      let data = { users: [], synonymGroups: [] };

      if (fs.existsSync(dbPath)) {
        const fileData = fs.readFileSync(dbPath, 'utf8');
        try {
          data = JSON.parse(fileData);
        } catch (e) {
          console.log('数据库文件损坏，重新创建');
          data = { users: [], synonymGroups: [] };
        }
      }

      if (!data.users) data.users = [];
      if (!data.synonymGroups) data.synonymGroups = [];
      if (!data.classes) data.classes = [];

      if (data.synonyms && Array.isArray(data.synonyms) && data.synonyms.length > 0) {
        data.synonymGroups = data.synonyms.map((group, index) => ({
          id: `migrated-${index}`,
          name: `迁移的同义词组 ${index + 1}`,
          category: '未分类',
          synonyms: group
        }));
        delete data.synonyms;
      }

      return {
        data,
        write: async () => {
          fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        }
      };
    } catch (error) {
      console.error('数据库连接失败:', error);
      throw error;
    }
  };

  module.exports = { connectDB };
}
