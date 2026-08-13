import { Injectable, NotFoundException } from '@nestjs/common';

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

  remove(id: number) {
    const task = this.findOne(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return task;
  }

  create(task: Task) {
    this.tasks.push(task);
    return task;
  }
}
