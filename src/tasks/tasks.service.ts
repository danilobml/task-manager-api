import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getFilteredTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) tasks = tasks.filter((task: Task) => task.status === status);
    if (search)
      tasks = tasks.filter(
        (task: Task) =>
          task.description.toLowerCase().includes(search.toLowerCase()) ||
          task.title.toLowerCase().includes(search.toLowerCase()),
      );
    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task: Task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): string {
    const found = this.getTaskById(id);
    const filteredTasks = this.tasks.filter(
      (task: Task) => task.id !== found.id,
    );
    this.tasks = filteredTasks;
    return 'Task successfully deleted';
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
