/**
 * 照片墙API服务
 * 封装照片墙相关的API请求
 */

import { get, post, upload } from './request';

/**
 * 获取所有照片
 * @returns {Promise} 照片列表
 */
export const getAllPhotos = () => {
  return get('/photowall');
};

/**
 * 上传照片
 * @param {FormData} formData - 包含照片和元数据的表单数据
 * @returns {Promise} 上传结果
 */
export const uploadPhoto = (formData) => {
  return upload('/photowall/upload', formData);
};

/**
 * 获取特定照片信息
 * @param {string} id - 照片ID
 * @returns {Promise} 照片信息
 */
export const getPhotoById = (id) => {
  return get(`/photowall/${id}`);
};

/**
 * 删除照片
 * @param {string} id - 照片ID
 * @returns {Promise} 删除结果
 */
export const deletePhoto = (id) => {
  return get(`/photowall/delete/${id}`);
};

export default {
  getAllPhotos,
  uploadPhoto,
  getPhotoById,
  deletePhoto
};