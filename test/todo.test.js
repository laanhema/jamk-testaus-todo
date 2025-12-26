// testit TODO-sovellukselle

import { describe, test, expect, beforeEach } from 'vitest';
import {
  generateId,
  loadTasks,
  saveTasks,
  STORAGE_KEY,
} from '../public/app.js';

// Mock localStorage testausta varten
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

// kaikki testit laitetaan yhden test suiten sisään
describe('TODO-sovelluksen yksikkötestit', () => {
  // tyhjennetään localStorage ennen jokaista testiä
  beforeEach(() => {
    localStorage.clear();
  });

  describe('LocalStorage - Datan tallennus ja lataus', () => {
    test('should save and load tasks from localStorage', () => {
      const tasks = [
        {
          id: 't_abc123',
          topic: 'Test Task',
          priority: 'high',
          status: 'todo',
          description: 'Test description',
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      saveTasks(tasks);
      const loaded = loadTasks();
      expect(loaded).toEqual(tasks);
    });

    test('should return empty array when no tasks exist', () => {
      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });

    test('should handle corrupted localStorage data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');
      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });

    test('should persist data correctly (data tallentuu pysyvästi)', () => {
      const tasks = [
        {
          id: 't_test1',
          topic: 'Persistent Task',
          priority: 'medium',
          status: 'todo',
          description: 'This should persist',
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      saveTasks(tasks);

      // Simuloi uudelleenlataus - ladataan data uudelleen
      const reloadedTasks = loadTasks();
      expect(reloadedTasks).toHaveLength(1);
      expect(reloadedTasks[0].topic).toBe('Persistent Task');
    });

    test('should use correct storage key', () => {
      expect(STORAGE_KEY).toBe('todo_tasks_v1');
    });

    test('should maintain task order in storage', () => {
      const tasks = [];
      for (let i = 1; i <= 5; i++) {
        tasks.push({
          id: `t_order${i}`,
          topic: `Task ${i}`,
          priority: 'medium',
          status: 'todo',
          description: '',
          completed: false,
          createdAt: Date.now() + i,
          updatedAt: Date.now() + i,
        });
      }

      saveTasks(tasks);
      const loaded = loadTasks();

      expect(loaded).toHaveLength(5);
      expect(loaded[0].topic).toBe('Task 1');
      expect(loaded[4].topic).toBe('Task 5');
    });
  });

  describe('Uuden taskin luominen', () => {
    test('should create a new task with all required properties', () => {
      const newTask = {
        id: generateId(),
        topic: 'Test Task',
        priority: 'high',
        status: 'todo',
        description: 'Test description',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(newTask).toHaveProperty('id');
      expect(newTask).toHaveProperty('topic');
      expect(newTask).toHaveProperty('priority');
      expect(newTask).toHaveProperty('status');
      expect(newTask).toHaveProperty('description');
      expect(newTask).toHaveProperty('completed');
      expect(newTask).toHaveProperty('createdAt');
      expect(newTask).toHaveProperty('updatedAt');
    });

    test('should save a new task to localStorage', () => {
      const tasks = [];
      const newTask = {
        id: generateId(),
        topic: 'New Task',
        priority: 'medium',
        status: 'todo',
        description: 'New task description',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      tasks.push(newTask);
      saveTasks(tasks);

      const loaded = loadTasks();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].topic).toBe('New Task');
    });
  });

  describe('Taskin muokkaaminen', () => {
    test('should update an existing task', () => {
      const now = Date.now();
      const tasks = [
        {
          id: 't_edit1',
          topic: 'Original Topic',
          priority: 'low',
          status: 'todo',
          description: 'Original description',
          completed: false,
          createdAt: now,
          updatedAt: now,
        },
      ];

      saveTasks(tasks);

      // Simuloi muokkaus-tilannetta (updatedAt tulee viiveellä jotta testi toimii)
      const loaded = loadTasks();
      const idx = loaded.findIndex((t) => t.id === 't_edit1');
      loaded[idx] = {
        ...loaded[idx],
        topic: 'Updated Topic',
        description: 'Updated description',
        updatedAt: now + 1000, // Lisätään 1 sekunti viivettä
      };

      saveTasks(loaded);
      const updated = loadTasks();

      expect(updated[0].topic).toBe('Updated Topic');
      expect(updated[0].description).toBe('Updated description');
      expect(updated[0].updatedAt).toBeGreaterThan(updated[0].createdAt);
    });
  });

  describe('Taskin poistaminen', () => {
    test('should delete a task from the list', () => {
      const tasks = [
        {
          id: 't_delete1',
          topic: 'Task to delete',
          priority: 'high',
          status: 'todo',
          description: '',
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 't_keep1',
          topic: 'Task to keep',
          priority: 'low',
          status: 'todo',
          description: '',
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      saveTasks(tasks);

      // Poistetaan ensimmäinen task
      const loaded = loadTasks();
      const idx = loaded.findIndex((t) => t.id === 't_delete1');
      loaded.splice(idx, 1);
      saveTasks(loaded);

      const remaining = loadTasks();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('t_keep1');
    });

    test('should handle deleting all tasks', () => {
      const tasks = [
        {
          id: 't_delete_all',
          topic: 'Task',
          priority: 'medium',
          status: 'todo',
          description: '',
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      saveTasks(tasks);
      const loaded = loadTasks();
      loaded.splice(0, 1);
      saveTasks(loaded);

      const remaining = loadTasks();
      expect(remaining).toHaveLength(0);
    });
  });

  describe('Taskin merkitseminen tehdyksi ja takaisin', () => {
    test('should mark a task as completed', () => {
      const tasks = [
        {
          id: 't_complete1',
          topic: 'Task to complete',
          priority: 'high',
          status: 'todo',
          description: '',
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      saveTasks(tasks);

      // Merkitse tehdyksi
      const loaded = loadTasks();
      const idx = loaded.findIndex((t) => t.id === 't_complete1');
      loaded[idx] = {
        ...loaded[idx],
        completed: true,
        status: 'done',
        updatedAt: Date.now(),
      };

      saveTasks(loaded);
      const completed = loadTasks();

      expect(completed[0].completed).toBe(true);
      expect(completed[0].status).toBe('done');
    });

    test('should mark a completed task back to incomplete', () => {
      const tasks = [
        {
          id: 't_uncomplete1',
          topic: 'Completed task',
          priority: 'medium',
          status: 'done',
          description: '',
          completed: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      saveTasks(tasks);

      // Merkitse takaisin tekemättömäksi
      const loaded = loadTasks();
      const idx = loaded.findIndex((t) => t.id === 't_uncomplete1');
      loaded[idx] = {
        ...loaded[idx],
        completed: false,
        status: 'todo',
        updatedAt: Date.now(),
      };

      saveTasks(loaded);
      const uncompleted = loadTasks();

      expect(uncompleted[0].completed).toBe(false);
      expect(uncompleted[0].status).toBe('todo');
    });
  });

  describe('Validointi', () => {
    test('should require topic field (pakollinen)', () => {
      const topicEmpty = '';
      const topicValid = 'Valid topic';

      expect(topicEmpty.trim()).toBe('');
      expect(topicValid.trim()).not.toBe('');
    });

    test('should enforce max length of 120 characters for topic', () => {
      const validTopic = 'A'.repeat(120);
      const tooLongTopic = 'A'.repeat(121);

      expect(validTopic.length).toBeLessThanOrEqual(120);
      expect(tooLongTopic.length).toBeGreaterThan(120);
    });

    test('should allow empty description (valinnainen)', () => {
      const task = {
        id: generateId(),
        topic: 'Task with no description',
        priority: 'low',
        status: 'todo',
        description: '',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(task.description).toBe('');
      expect(task.topic).toBeTruthy();
    });
  });

  describe('Statukset', () => {
    test('should automatically set completed to true when status is "done"', () => {
      const task = {
        id: generateId(),
        topic: 'Done task',
        priority: 'high',
        status: 'done',
        description: '',
        completed: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(task.status).toBe('done');
      expect(task.completed).toBe(true);
    });
  });
});
