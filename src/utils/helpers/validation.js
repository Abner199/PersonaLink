/**
 * 表单验证工具函数
 * 提供常用的表单验证方法
 */

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
export const validatePassword = (password) => {
  const result = {
    isValid: true,
    errors: []
  };
  
  if (!password) {
    result.isValid = false;
    result.errors.push('密码不能为空');
    return result;
  }
  
  if (password.length < 6) {
    result.isValid = false;
    result.errors.push('密码长度至少为6位');
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('密码必须包含字母');
  }
  
  if (!/[0-9]/.test(password)) {
    result.isValid = false;
    result.errors.push('密码必须包含数字');
  }
  
  return result;
};

/**
 * 验证用户注册表单
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果
 */
export const validateRegistrationForm = (formData) => {
  const result = {
    isValid: true,
    errors: {}
  };
  
  // 验证姓名
  if (!formData.name || formData.name.trim() === '') {
    result.isValid = false;
    result.errors.name = '姓名不能为空';
  }
  
  // 验证邮箱
  if (!formData.email) {
    result.isValid = false;
    result.errors.email = '邮箱不能为空';
  } else if (!isValidEmail(formData.email)) {
    result.isValid = false;
    result.errors.email = '请输入有效的邮箱地址';
  }
  
  // 验证密码
  if (!formData.password) {
    result.isValid = false;
    result.errors.password = '密码不能为空';
  } else {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      result.isValid = false;
      result.errors.password = passwordValidation.errors[0];
    }
  }
  
  // 验证确认密码
  if (formData.password !== formData.confirmPassword) {
    result.isValid = false;
    result.errors.confirmPassword = '两次输入的密码不一致';
  }
  
  return result;
};

/**
 * 验证用户登录表单
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果
 */
export const validateLoginForm = (formData) => {
  const result = {
    isValid: true,
    errors: {}
  };
  
  // 验证邮箱
  if (!formData.email) {
    result.isValid = false;
    result.errors.email = '邮箱不能为空';
  } else if (!isValidEmail(formData.email)) {
    result.isValid = false;
    result.errors.email = '请输入有效的邮箱地址';
  }
  
  // 验证密码
  if (!formData.password) {
    result.isValid = false;
    result.errors.password = '密码不能为空';
  }
  
  return result;
};

/**
 * 验证班级表单
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果
 */
export const validateClassForm = (formData) => {
  const result = {
    isValid: true,
    errors: {}
  };
  
  // 验证班级名称
  if (!formData.name || formData.name.trim() === '') {
    result.isValid = false;
    result.errors.name = '班级名称不能为空';
  }
  
  // 验证班级描述
  if (!formData.description || formData.description.trim() === '') {
    result.isValid = false;
    result.errors.description = '班级描述不能为空';
  }
  
  return result;
};

/**
 * 验证同义词表单
 * @param {Object} formData - 表单数据
 * @returns {Object} 验证结果
 */
export const validateSynonymForm = (formData) => {
  const result = {
    isValid: true,
    errors: {}
  };
  
  // 验证同义词组名称
  if (!formData.name || formData.name.trim() === '') {
    result.isValid = false;
    result.errors.name = '同义词组名称不能为空';
  }
  
  // 验证同义词列表
  if (!formData.synonyms || formData.synonyms.length === 0) {
    result.isValid = false;
    result.errors.synonyms = '至少需要添加一个同义词';
  } else {
    // 检查是否有空值
    const hasEmptySynonym = formData.synonyms.some(synonym => !synonym || synonym.trim() === '');
    if (hasEmptySynonym) {
      result.isValid = false;
      result.errors.synonyms = '同义词不能为空';
    }
    
    // 检查是否有重复
    const uniqueSynonyms = [...new Set(formData.synonyms)];
    if (uniqueSynonyms.length !== formData.synonyms.length) {
      result.isValid = false;
      result.errors.synonyms = '同义词不能重复';
    }
  }
  
  return result;
};