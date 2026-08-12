import { Injectable } from '@nestjs/common';

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

  create(task: Task) {
    this.tasks.push(task);
    return task;
  }
}
