import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Food, 
  Meal, 
  FoodLog, 
  DailySummary, 
  WeeklySummary, 
  RangeSummary,
  CreateFoodRequest,
  CreateMealRequest,
  CreateLogRequest
} from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Foods API
export const foodsAPI = {
  getAll: (search = ''): Promise<AxiosResponse<Food[]>> => 
    api.get<Food[]>(`/api/foods${search ? `?search=${search}` : ''}`),
  getById: (id: number): Promise<AxiosResponse<Food>> => 
    api.get<Food>(`/api/foods/${id}`),
  create: (data: CreateFoodRequest): Promise<AxiosResponse<Food>> => 
    api.post<Food>('/api/foods', data),
  update: (id: number, data: Partial<CreateFoodRequest>): Promise<AxiosResponse<Food>> => 
    api.put<Food>(`/api/foods/${id}`, data),
  delete: (id: number): Promise<AxiosResponse<{ message: string }>> => 
    api.delete(`/api/foods/${id}`),
};

// Meals API
export const mealsAPI = {
  getAll: (): Promise<AxiosResponse<Meal[]>> => 
    api.get<Meal[]>('/api/meals'),
  getById: (id: number): Promise<AxiosResponse<Meal>> => 
    api.get<Meal>(`/api/meals/${id}`),
  create: (data: CreateMealRequest): Promise<AxiosResponse<Meal>> => 
    api.post<Meal>('/api/meals', data),
  update: (id: number, data: Partial<CreateMealRequest>): Promise<AxiosResponse<Meal>> => 
    api.put<Meal>(`/api/meals/${id}`, data),
  delete: (id: number): Promise<AxiosResponse<{ message: string }>> => 
    api.delete(`/api/meals/${id}`),
};

// Food Log API
export const logsAPI = {
  getAll: (params: { date?: string; start_date?: string; end_date?: string } = {}): Promise<AxiosResponse<FoodLog[]>> => 
    api.get<FoodLog[]>('/api/logs', { params }),
  getById: (id: number): Promise<AxiosResponse<FoodLog>> => 
    api.get<FoodLog>(`/api/logs/${id}`),
  create: (data: CreateLogRequest): Promise<AxiosResponse<FoodLog>> => 
    api.post<FoodLog>('/api/logs', data),
  update: (id: number, data: Partial<CreateLogRequest>): Promise<AxiosResponse<FoodLog>> => 
    api.put<FoodLog>(`/api/logs/${id}`, data),
  delete: (id: number): Promise<AxiosResponse<{ message: string }>> => 
    api.delete(`/api/logs/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDailySummary: (date: string): Promise<AxiosResponse<DailySummary>> => 
    api.get<DailySummary>(`/api/analytics/daily/${date}`),
  getWeeklySummary: (startDate: string): Promise<AxiosResponse<WeeklySummary>> => 
    api.get<WeeklySummary>(`/api/analytics/weekly/${startDate}`),
  getRangeSummary: (startDate: string, endDate: string): Promise<AxiosResponse<RangeSummary>> => 
    api.get<RangeSummary>(`/api/analytics/range/${startDate}/${endDate}`),
};

export default api;
