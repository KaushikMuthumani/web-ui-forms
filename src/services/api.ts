import axios from 'axios';
import { Task, CreateTaskRequest, TaskExecution } from '../types/task';

const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance with proper types
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Get all tasks or single task by ID
  async getTasks(id?: string): Promise<Task[]> {
    try {
      const url = id ? `/tasks?id=${id}` : '/tasks';
      const response = await api.get<Task[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create or update a task
  async createOrUpdateTask(task: CreateTaskRequest): Promise<Task> {
    try {
      const response = await api.put<Task>('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Error creating/updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Search tasks by name
  async searchTasks(name: string): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>(`/tasks/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error: any) {
      // Handle 404 specifically for search
      if (error.response?.status === 404) {
        return [];
      }
      console.error('Error searching tasks:', error);
      throw error;
    }
  },

  // Execute a task
  async executeTask(id: string): Promise<TaskExecution> {
    try {
      const response = await api.put<TaskExecution>(`/tasks/${id}/execute`);
      return response.data;
    } catch (error) {
      console.error('Error executing task:', error);
      throw error;
    }
  },
};
