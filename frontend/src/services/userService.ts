import axios from 'axios';
import { API_BASE_URL } from '../config/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token'ı otomatik ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 durumunda token'ı temizle
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  user?: T;
  error?: string;
}

class UserService {
  // Kullanıcı kaydı
  async register(data: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.post('/user/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Kayıt olurken hata oluştu');
    }
  }

  // Kullanıcı girişi
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/user/login', data);
      const { token, user } = response.data;
      
      // Token ve user bilgilerini localStorage'a kaydet
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Giriş yaparken hata oluştu');
    }
  }

  // Kullanıcı profili getir
  async getProfile(): Promise<{ user: User }> {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Profil bilgileri alınamadı');
    }
  }

  // Profil güncelle
  async updateProfile(data: { email: string }): Promise<ApiResponse<User>> {
    try {
      const response = await api.put('/user/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Profil güncellenirken hata oluştu');
    }
  }

  // Çıkış yap
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Token kontrolü
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Mevcut kullanıcı bilgilerini al
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error('Servis erişilemiyor');
    }
  }
}

export const userService = new UserService();
export default userService;
