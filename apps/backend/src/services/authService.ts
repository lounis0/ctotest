import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../database';
import { env } from '../env';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const SALT_ROUNDS = 10;

export const authService = {
  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, SALT_ROUNDS);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  },

  generateAccessToken(userId: string, email: string): string {
    const payload: JWTPayload = { userId, email };
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  },

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn,
    });
  },

  verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, env.jwtSecret) as JWTPayload;
  },

  verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, env.jwtRefreshSecret) as { userId: string };
  },

  async createUser(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User> {
    const passwordHash = await this.hashPassword(password);
    const userId = uuidv4();

    const result = await pool.query<User & { first_name: string | null; last_name: string | null; email_verified: boolean; created_at: Date; updated_at: Date }>(
      `INSERT INTO users (id, email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, email_verified, created_at, updated_at`,
      [userId, email, passwordHash, firstName || null, lastName || null],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      emailVerified: row.email_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async getUserById(userId: string): Promise<User | null> {
    const result = await pool.query<User & { first_name: string | null; last_name: string | null; email_verified: boolean; created_at: Date; updated_at: Date }>(
      `SELECT id, email, first_name, last_name, email_verified, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      emailVerified: row.email_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const result = await pool.query<User & { first_name: string | null; last_name: string | null; email_verified: boolean; created_at: Date; updated_at: Date; password_hash: string }>(
      `SELECT id, email, password_hash, first_name, last_name, email_verified, created_at, updated_at
       FROM users WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      emailVerified: row.email_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      passwordHash: row.password_hash,
    };
  },

  async createSession(userId: string, refreshToken: string): Promise<string> {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      `INSERT INTO sessions (id, user_id, refresh_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [sessionId, userId, refreshToken, expiresAt],
    );

    return sessionId;
  },

  async getSession(sessionId: string): Promise<{ userId: string; refreshToken: string } | null> {
    const result = await pool.query<{ user_id: string; refresh_token: string }>(
      `SELECT user_id, refresh_token FROM sessions
       WHERE id = $1 AND expires_at > NOW()`,
      [sessionId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      userId: row.user_id,
      refreshToken: row.refresh_token,
    };
  },

  async deleteSession(sessionId: string): Promise<void> {
    await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
  },

  async updateUserProfile(
    userId: string,
    updates: Partial<{ firstName: string; lastName: string }>,
  ): Promise<User> {
    const result = await pool.query<User & { first_name: string | null; last_name: string | null; email_verified: boolean; created_at: Date; updated_at: Date }>(
      `UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email, first_name, last_name, email_verified, created_at, updated_at`,
      [userId, updates.firstName || null, updates.lastName || null],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      emailVerified: row.email_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};
