import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
  },
  workerAPI: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

import { authAPI, workerAPI } from '../services/api';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation error for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.queryByText(/required/i)).toBeInTheDocument();
    });
  });

  it('calls login API when form is submitted', async () => {
    const user = userEvent.setup();
    authAPI.login.mockResolvedValueOnce({
      data: {
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        user: { id: '1', name: 'Test User', role: 'user' },
      },
    });

    render(<LoginPage />);
    
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});

describe('WorkerCard', () => {
  it('renders worker information correctly', () => {
    const mockWorker = {
      id: '1',
      user: { name: 'John Doe', avatar: null, city: 'Coimbatore' },
      skills: ['Electrician', 'Plumber'],
      experience: 5,
      hourly_rate: 300,
      rating_average: 4.5,
      rating_count: 20,
      availability: 'available',
    };

    render(<WorkerCard worker={mockWorker} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Electrician')).toBeInTheDocument();
    expect(screen.getByText('₹300/hr')).toBeInTheDocument();
  });
});