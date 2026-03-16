/**
 * 数据处理工具函数
 * 提供常用的数据处理方法
 */

/**
 * 格式化用户数据
 * @param {Object} user - 原始用户数据
 * @returns {Object} 格式化后的用户数据
 */
export const formatUserData = (user) => {
  if (!user) return null;
  
  return {
    id: user._id || user.id,
    name: user.name || '',
    email: user.email || '',
    hometown: user.hometown || '',
    hobby: user.hobby || '',
    avatar: user.avatar || 'https://picsum.photos/seed/default/200/200.jpg',
    class: user.class || '未分配班级',
    profile: user.profile || {
      bio: '',
      skills: [],
      social: {}
    }
  };
};

/**
 * 格式化班级数据
 * @param {Object} classData - 原始班级数据
 * @returns {Object} 格式化后的班级数据
 */
export const formatClassData = (classData) => {
  if (!classData) return null;
  
  return {
    id: classData._id || classData.id,
    name: classData.name || '',
    description: classData.description || '',
    members: classData.members || [],
    createdAt: classData.createdAt || new Date(),
    updatedAt: classData.updatedAt || new Date()
  };
};

/**
 * 格式化同义词数据
 * @param {Object} synonymData - 原始同义词数据
 * @returns {Object} 格式化后的同义词数据
 */
export const formatSynonymData = (synonymData) => {
  if (!synonymData) return null;
  
  return {
    id: synonymData._id || synonymData.id,
    name: synonymData.name || '',
    synonyms: synonymData.synonyms || [],
    createdAt: synonymData.createdAt || new Date(),
    updatedAt: synonymData.updatedAt || new Date()
  };
};

/**
 * 格式化照片数据
 * @param {Object} photoData - 原始照片数据
 * @returns {Object} 格式化后的照片数据
 */
export const formatPhotoData = (photoData) => {
  if (!photoData) return null;
  
  return {
    id: photoData._id || photoData.id,
    url: photoData.url || '',
    title: photoData.title || '',
    description: photoData.description || '',
    tags: photoData.tags || [],
    uploadedBy: photoData.uploadedBy || '',
    createdAt: photoData.createdAt || new Date()
  };
};

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @param {string} format - 格式类型 ('date', 'datetime', 'time')
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'date') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`;
    case 'datetime':
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    case 'time':
      return `${hours}:${minutes}:${seconds}`;
    default:
      return `${year}-${month}-${day}`;
  }
};

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 检查对象是否为空
 * @param {Object} obj - 要检查的对象
 * @returns {boolean} 是否为空
 */
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * 数组去重
 * @param {Array} array - 要去重的数组
 * @param {string} key - 对象数组去重的键名
 * @returns {Array} 去重后的数组
 */
export const uniqueArray = (array, key) => {
  if (!Array.isArray(array)) return [];
  
  if (!key) {
    // 基本数组去重
    return [...new Set(array)];
  }
  
  // 对象数组根据指定键去重
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};