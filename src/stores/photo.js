import { defineStore } from 'pinia'
import { ref } from 'vue'
import { photoService } from '../utils/api'

export const usePhotoStore = defineStore('photo', () => {
  const photos = ref([])
  const currentPhoto = ref(null)
  const uploadProgress = ref(0)

  // 获取所有照片
  const fetchPhotos = async () => {
    try {
      const response = await photoService.getAllPhotos()
      photos.value = response
      return response
    } catch (error) {
      console.error('获取照片列表失败:', error)
      throw error
    }
  }

  // 获取特定照片信息
  const fetchPhotoById = async (photoId) => {
    try {
      const response = await photoService.getPhotoById(photoId)
      currentPhoto.value = response
      return response
    } catch (error) {
      console.error('获取照片信息失败:', error)
      throw error
    }
  }

  // 上传照片
  const uploadPhoto = async (file, metadata) => {
    try {
      uploadProgress.value = 0
      const response = await photoService.uploadPhoto(file, metadata, (progress) => {
        uploadProgress.value = progress
      })
      // 更新本地照片列表
      await fetchPhotos()
      return response
    } catch (error) {
      console.error('上传照片失败:', error)
      throw error
    }
  }

  // 删除照片
  const deletePhoto = async (photoId) => {
    try {
      const response = await photoService.deletePhoto(photoId)
      // 更新本地照片列表
      await fetchPhotos()
      return response
    } catch (error) {
      console.error('删除照片失败:', error)
      throw error
    }
  }

  // 获取照片URL
  const getPhotoUrl = (photoId) => {
    return photoService.getPhotoUrl(photoId)
  }

  return {
    photos,
    currentPhoto,
    uploadProgress,
    fetchPhotos,
    fetchPhotoById,
    uploadPhoto,
    deletePhoto,
    getPhotoUrl
  }
})