import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [
    {
      id: 1,
      title: 'Learn NestJS',
      completed: false,
    },
  ];

  findAll() {
    console.log(this);
    return this.tasks;
  }
}
