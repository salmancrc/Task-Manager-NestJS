import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Learn NestJS',
      completed: false,
    },
    {
      id: 2,
      title: 'Build a REST API',
      completed: false,
    },
    {
      id: 3,
      title: 'Practice TypeScript',
      completed: false,
    },
    {
      id: 4,
      title: 'Learn PostgreSQL',
      completed: false,
    },
    {
      id: 5,
      title: 'Create a Docker Project',
      completed: false,
    },
    {
      id: 6,
      title: 'Study Authentication',
      completed: false,
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const newTask: Task = {
      id:
        this.tasks.length > 0
          ? Math.max(...this.tasks.map((t) => t.id)) + 1
          : 1,
      title: createTaskDto.title,
      completed: createTaskDto.completed ?? false,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, updateTaskDto);
    return task;
  }

  remove(id: number): Task {
    const task = this.findOne(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return task;
  }
}
