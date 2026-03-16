// API配置文件
// 根据环境自动选择API地址

const getApiBaseUrl = () => {
  // 构建时注入的环境变量（GitHub Pages静态部署时指向Netlify后端）
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // 本地开发
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3003/api';
  }

  // Netlify / 自有服务器（通过Nginx代理 /api）
  return `${protocol}//${hostname}/api`;
};

export const API_BASE_URL = getApiBaseUrl();