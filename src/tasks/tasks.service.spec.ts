import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task.model';

const mockTaksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser: User = {
  id: '1',
  username: 'Max',
  password: 'testpass',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTaksRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });
  describe('getTasks', () => {
    it('calls TasksRepository getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(mockUser, null);
      expect(result).toEqual('someValue');
    });
  });

  describe('hetTaskById', () => {
    it('calls TaskRepository.findOne and returns result', async () => {
      const mockTask = {
        id: '1',
        title: 'Test',
        description: 'Test',
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksRepository.findOne('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('call TaskRepository.findOne and handles error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        'Task with id someId not found',
      );
    });
  });
});
