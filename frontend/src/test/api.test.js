import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authAPI', () => {
    it('should call login endpoint correctly', async () => {
      const mockResponse = {
        data: {
          success: true,
          accessToken: 'test-token',
          refreshToken: 'refresh-token',
          user: { id: '1', name: 'Test User' },
        },
      };
      axios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
      });

      const { authAPI } = await import('../services/api');
      const result = await authAPI.login({ email: 'test@test.com', password: 'password' });

      expect(result.data.success).toBe(true);
    });
  });

  describe('workerAPI', () => {
    it('should fetch workers with filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          workers: [{ id: '1', user: { name: 'Worker 1' } }],
          pagination: { total: 1, page: 1, pages: 1 },
        },
      };
      axios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
      });

      const { workerAPI } = await import('../services/api');
      const result = await workerAPI.getAll({ skill: 'Electrician' });

      expect(result.data.workers).toHaveLength(1);
    });
  });
});

describe('Auth Store', () => {
  it('should initialize with localStorage data', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'accessToken') return 'test-token';
      if (key === 'user') return JSON.stringify({ id: '1', name: 'Test User' });
      return null;
    });

    const { default: useAuthStore } = require('../context/authStore');
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ id: '1', name: 'Test User' });
  });
});