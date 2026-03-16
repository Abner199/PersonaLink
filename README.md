# PersonaLink - 个人信息分享平台

这是一个基于Vue 3和Node.js的个人信息分享平台，实现了分班功能、瀑布流照片墙和用户检索功能，解决了局域网内信息共享的问题。

## 项目架构

- **前端**: Vue 3 + Pinia + Vite
- **后端**: Node.js + Express + LowDB (文件数据库)

## 功能特性

1. 用户注册和登录
2. 分班管理和班级选择
3. 个人资料管理
4. 瀑布流照片墙展示
5. 用户搜索和同义词管理
6. 局域网内用户信息共享

## 文档

详细文档请参考 [docs](./docs) 目录，包含：
- [部署指南](./DEPLOYMENT.md)
- [项目文档](./PROJECT.md)
- [性能优化指南](./docs/performance-optimization-guide.md)
- [测试报告](./docs/test-report.md)
- [测试计划](./docs/test-plan.md)

## 运行指南

### 前置条件

- Node.js 14.x 或更高版本
- npm 6.x 或更高版本

### 后端运行步骤

1. 打开命令行工具并进入项目目录
2. 进入后端目录
   ```
   cd backend
   ```
3. 安装依赖（如果遇到权限问题，请以管理员身份运行命令行）
   ```
   npm install
   ```
4. 初始化数据库
   ```
   node init-db.js
   ```
5. 启动后端服务器
   ```
   npm run dev
   ```
   或
   ```
   node server.js
   ```

### 前端运行步骤

1. 打开另一个命令行工具并进入项目目录
2. 安装依赖
   ```
   npm install
   ```
3. 启动开发服务器
   ```
   npm run dev
   ```

## 访问方式

- 前端应用: http://localhost:3000
- 后端API: http://localhost:3003

## 示例用户

初始化数据库后，系统会创建一个示例用户：
- 邮箱: admin@example.com
- 密码: admin123

## 注意事项

1. 本项目使用LowDB作为文件数据库，仅适用于开发和测试环境
2. 在生产环境中，请使用正式的数据库如MongoDB、MySQL等
3. 密码存储未加密，生产环境中应使用bcrypt等库进行加密
4. 系统默认配置支持局域网访问，确保你的设备在同一局域网内

## 故障排查

1. 如果遇到权限问题，尝试以管理员身份运行命令行
2. 确保后端服务器已启动，否则前端无法访问API
3. 检查vite.config.js中的代理配置是否正确
4. 查看控制台日志以获取更多错误信息