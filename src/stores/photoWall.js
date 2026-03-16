import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../config/api.js'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const usePhotoWallStore = defineStore('photoWall', {
  state: () => ({
    users: [],
    filteredUsers: [],
    classes: [],
    isLoading: false,
    error: null,
    selectedClassId: 'all'
  }),

  getters: {
    // 获取所有班级选项
    classOptions: (state) => {
      return [
        { value: 'all', label: '全部班级' },
        ...state.classes.map(cls => ({
          value: cls.id,
          label: cls.name
        }))
      ]
    }
  },

  actions: {
    // 获取所有用户
    async fetchUsers() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.get('/photowall')
        if (response.data.success) {
          this.users = response.data.data
          this.filterUsers()
        } else {
          this.error = response.data.message || '获取用户列表失败'
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        this.error = '获取用户列表失败，请稍后重试'
      } finally {
        this.isLoading = false
      }
    },

    // 根据班级ID获取用户
    async fetchUsersByClass(classId) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await apiClient.get(`/photowall/class/${classId}`)
        if (response.data.success) {
          this.users = response.data.data
          this.filterUsers()
        } else {
          this.error = response.data.message || '获取班级用户失败'
        }
      } catch (error) {
        console.error('获取班级用户失败:', error)
        this.error = '获取班级用户失败，请稍后重试'
      } finally {
        this.isLoading = false
      }
    },

    // 获取所有班级
    async fetchClasses() {
      try {
        const response = await apiClient.get('/classes')
        // 班级API直接返回数组数据，不是包装结构
        if (Array.isArray(response.data)) {
          this.classes = response.data
        } else {
          console.error('班级API返回的数据格式不正确:', response.data)
        }
      } catch (error) {
        console.error('获取班级列表失败:', error)
      }
    },

    // 设置选中的班级ID
    setSelectedClassId(classId) {
      this.selectedClassId = classId
      this.filterUsers()
    },

    // 根据选中的班级ID过滤用户
    filterUsers() {
      if (this.selectedClassId === 'all') {
        this.filteredUsers = [...this.users]
      } else {
        this.filteredUsers = this.users.filter(user => user.classId === this.selectedClassId)
      }
    },

    // 刷新数据
    async refreshData() {
      if (this.selectedClassId === 'all') {
        await this.fetchUsers()
      } else {
        await this.fetchUsersByClass(this.selectedClassId)
      }
    }
  }
})