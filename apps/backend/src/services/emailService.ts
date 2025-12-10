import nodemailer from 'nodemailer';
import { env } from '../env';

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: false,
  auth:
    env.emailUser && env.emailPassword
      ? {
          user: env.emailUser,
          pass: env.emailPassword,
        }
      : undefined,
});

export const emailService = {
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: env.emailFrom,
        to: email,
        subject: 'Welcome to our app!',
        html: `
          <h1>Welcome, ${firstName || 'User'}!</h1>
          <p>Your account has been created successfully.</p>
          <p>You can now login with your credentials.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw - email is non-critical
    }
  },

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: env.emailFrom,
        to: email,
        subject: 'Password Reset',
        html: `
          <h1>Password Reset</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link expires in 1 hour.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  },
};
