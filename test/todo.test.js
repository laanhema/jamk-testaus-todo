import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateId,
  escapeHtml,
  badgeForStatus,
  loadTasks,
  saveTasks,
  STORAGE_KEY,
} from '../public/app.js';

// Mock localStorage for testing
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

describe('Todo App Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('generateId', () => {
    it('should generate an ID starting with "t_"', () => {
      const id = generateId();
      expect(id).toMatch(/^t_/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('&')).toBe('&amp;');
      expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
      expect(escapeHtml("'test'")).toBe('&#039;test&#039;');
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('badgeForStatus', () => {
    it('should return correct badge for "todo" status', () => {
      const result = badgeForStatus('todo');
      expect(result).toContain('To do');
      expect(result).toContain('badge');
    });

    it('should return correct badge for "in-progress" status', () => {
      const result = badgeForStatus('in-progress');
      expect(result).toContain('In progress');
    });

    it('should return correct badge for "blocked" status', () => {
      const result = badgeForStatus('blocked');
      expect(result).toContain('Blocked');
    });

    it('should return correct badge for "done" status', () => {
      const result = badgeForStatus('done');
      expect(result).toContain('Done');
    });
  });

  describe('saveTasks and loadTasks', () => {
    it('should save and load tasks from localStorage', () => {
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

    it('should return empty array when no tasks exist', () => {
      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');
      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });
  });
});
