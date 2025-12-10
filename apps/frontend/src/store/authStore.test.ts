import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './authStore';

// Mock fetch
global.fetch = vi.fn();

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with null user and no tokens', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set user', () => {
    const { result } = renderHook(() => useAuthStore());
    const testUser = {
      id: '123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };

    act(() => {
      result.current.setUser(testUser);
    });

    expect(result.current.user).toEqual(testUser);
  });

  it('should set tokens and persist to localStorage', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setTokens('access123', 'refresh456', 'session789');
    });

    expect(result.current.accessToken).toBe('access123');
    expect(result.current.refreshToken).toBe('refresh456');
    expect(result.current.sessionId).toBe('session789');
    expect(result.current.isAuthenticated).toBe(true);

    // Check localStorage
    expect(localStorage.getItem('accessToken')).toBe('access123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh456');
    expect(localStorage.getItem('sessionId')).toBe('session789');
  });

  it('should set error message', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setIsLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });
});
