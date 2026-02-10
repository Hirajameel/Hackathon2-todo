import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'default-secret-key-for-development-only',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: {
    // Better Auth will use the backend for authentication
    // This is a client-side configuration
    type: 'memory', // Using memory for client-side
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

export type Session = typeof auth.$Infer.Session;
