import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/users/refresh-token`,
            { refreshToken },
            { withCredentials: true }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ValidationResponse {
  user: User;
}

export interface ChatRequest {
  question: string;
  image?: File;
}

export interface ChatResponse {
  answer: string;
}

export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await apiClient.post('/users/login', credentials);
      
      // Store tokens in localStorage
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Login failed');
    }
  },

  async signup(userData: SignupRequest): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await apiClient.post('/users/signup', userData);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Signup failed');
      }
      throw new Error('Signup failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/users/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      // Clear tokens even if logout request fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Logout failed');
    }
  },

  async validateToken(): Promise<ValidationResponse> {
    try {
      const response: AxiosResponse<ApiResponse<ValidationResponse>> = await apiClient.get('/users/validate-token');
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Token validation failed');
      }
      throw new Error('Token validation failed');
    }
  },

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response: AxiosResponse<ApiResponse<{ accessToken: string; refreshToken: string }>> = 
        await apiClient.post('/users/refresh-token', { refreshToken });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Token refresh failed');
      }
      throw new Error('Token refresh failed');
    }
  }
};

export const chatAPI = {
  async sendMessage(question: string, image?: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('question', question);
      
      if (image) {
        formData.append('image', image);
      }

      const response: AxiosResponse<ApiResponse<string>> = await apiClient.post(
        '/users/chat',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Chat request failed');
      }
      throw new Error('Chat request failed');
    }
  }
};
