import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from './authService';
import bcryptjs from 'bcryptjs';

describe('authService', () => {
  describe('password hashing and verification', () => {
    it('should hash a password', async () => {
      const password = 'test-password-123';
      const hash = await authService.hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash).toBeTruthy();
    });

    it('should verify a correct password', async () => {
      const password = 'test-password-123';
      const hash = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'test-password-123';
      const hash = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword('wrong-password', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT tokens', () => {
    it('should generate a valid access token', () => {
      const userId = 'test-user-id';
      const email = 'test@example.com';

      const token = authService.generateAccessToken(userId, email);

      expect(token).toBeTruthy();
      const decoded = authService.verifyAccessToken(token);
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should generate a valid refresh token', () => {
      const userId = 'test-user-id';

      const token = authService.generateRefreshToken(userId);

      expect(token).toBeTruthy();
      const decoded = authService.verifyRefreshToken(token);
      expect(decoded.userId).toBe(userId);
    });

    it('should fail to verify an invalid token', () => {
      expect(() => {
        authService.verifyAccessToken('invalid-token');
      }).toThrow();
    });
  });
});
