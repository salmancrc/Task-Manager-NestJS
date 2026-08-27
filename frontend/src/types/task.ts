// Central TypeScript interfaces shared across the entire app

export interface Task {
  id: number
  title: string
  completed: boolean
  userId?: number | null
}

export interface CreateTaskDto {
  title: string
  completed?: boolean
}

export interface UpdateTaskDto {
  title?: string
  completed?: boolean
}

export interface GetTasksParams {
  search?: string
  status?: 'completed' | 'pending' | ''
  page?: number
  limit?: number
}
