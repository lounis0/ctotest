import express, { Response } from 'express';
import { authService } from '../services/authService';
import { emailService } from '../services/emailService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Signup
router.post('/signup', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    // Check if user already exists
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    // Create user
    const user = await authService.createUser(email, password, firstName, lastName);

    // Send welcome email
    await emailService.sendWelcomeEmail(email, firstName || '');

    // Generate tokens
    const refreshToken = authService.generateRefreshToken(user.id);
    const accessToken = authService.generateAccessToken(user.id, user.email);

    // Create session
    const sessionId = await authService.createSession(user.id, refreshToken);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
      refreshToken,
      sessionId,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await authService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const passwordValid = await authService.verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate tokens
    const refreshToken = authService.generateRefreshToken(user.id);
    const accessToken = authService.generateAccessToken(user.id, user.email);

    // Create session
    const sessionId = await authService.createSession(user.id, refreshToken);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
      refreshToken,
      sessionId,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
router.post('/refresh', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    try {
      const payload = authService.verifyRefreshToken(refreshToken);

      // Get user
      const user = await authService.getUserById(payload.userId);
      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      // Generate new access token
      const newAccessToken = authService.generateAccessToken(user.id, user.email);

      res.json({
        accessToken: newAccessToken,
      });
    } catch {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (sessionId) {
      await authService.deleteSession(sessionId);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await authService.getUserById(req.userId!);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
