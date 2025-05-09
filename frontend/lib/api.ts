import axios from 'axios';

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definitions
export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Post API calls
export const postsApi = {
  // Get paginated posts with optional search
  getPosts: async (page = 1, perPage = 10, search = ''): Promise<PaginatedResponse<Post>> => {
    const response = await api.get('/posts', {
      params: { page, per_page: perPage, search },
    });
    return response.data;
  },

  // Get a single post by ID
  getPost: async (id: string | number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id: string | number, postData: Partial<Post>): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (id: string | number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export default api; 