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

export interface Product {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
}

export interface ApiResponse<T> {
  message?: string;
  product?: T;
  products?: T[];
  error?: string;
}

class ProductService {
  // Tüm ürünleri getir
  async getProducts(): Promise<{ products: Product[] }> {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Ürünler alınamadı');
    }
  }

  // Kullanıcının ürünlerini getir
  async getMyProducts(): Promise<{ products: Product[] }> {
    try {
      const response = await api.get('/my-products');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Ürünleriniz alınamadı');
    }
  }

  // Ürün oluştur
  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Ürün oluşturulurken hata oluştu');
    }
  }

  // Ürün güncelle
  async updateProduct(id: number, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Ürün güncellenirken hata oluştu');
    }
  }

  // Ürün sil
  async deleteProduct(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Ürün silinirken hata oluştu');
    }
  }

  // Ürün resmi yükle
  async uploadProductImage(id: number, file: File): Promise<ApiResponse<Product>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Resim yüklenirken hata oluştu');
    }
  }

  // Resim URL'sini al
  getImageUrl(filename: string): string {
    return `${API_BASE_URL}/uploads/${filename}`;
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

export const productService = new ProductService();
export default productService;
