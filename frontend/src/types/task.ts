// Central TypeScript interfaces shared across the entire app

export interface Task {
  id: number
  title: string
  completed: boolean
  priority: TaskPriority
  dueDate: string | null
  deletedAt: string | null
  tags: Tag[]
  userId?: number | null
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Tag {
  id: number
  name: string
}

export interface CreateTaskDto {
  title: string
  completed?: boolean
  priority?: TaskPriority
  dueDate?: string
  tags?: string[]
}

export interface UpdateTaskDto {
  title?: string
  completed?: boolean
  priority?: TaskPriority
  dueDate?: string | null
  tags?: string[]
}

export interface GetTasksParams {
  search?: string
  status?: 'completed' | 'pending' | ''
  priority?: TaskPriority | ''
  tag?: string
  page?: number
  limit?: number
}
