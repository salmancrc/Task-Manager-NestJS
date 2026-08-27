import apiClient from './axios'
import type { Task, CreateTaskDto, UpdateTaskDto, GetTasksParams } from '../types/task'

// Get all tasks — supports search, status filter, and pagination via query params
export const getTasks = async (params: GetTasksParams): Promise<Task[]> => {
  // Remove empty string params so they don't get sent to the API
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined),
  )
  const res = await apiClient.get<Task[]>('/tasks', { params: cleanParams })
  return res.data
}

// Get a single task by its ID
export const getTaskById = async (id: number): Promise<Task> => {
  const res = await apiClient.get<Task>(`/tasks/${id}`)
  return res.data
}

// Create a new task
export const createTask = async (data: CreateTaskDto): Promise<Task> => {
  const res = await apiClient.post<Task>('/tasks', data)
  return res.data
}

// Partially update an existing task (title or completed status)
export const updateTask = async (id: number, data: UpdateTaskDto): Promise<Task> => {
  const res = await apiClient.patch<Task>(`/tasks/${id}`, data)
  return res.data
}

// Delete a task and return the deleted task data
export const deleteTask = async (id: number): Promise<Task> => {
  const res = await apiClient.delete<Task>(`/tasks/${id}`)
  return res.data
}
