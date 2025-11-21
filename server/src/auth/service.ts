import { hash, verify } from '@node-rs/argon2'
import { prisma } from '../lib/prisma.js'
import { lucia } from './lucia.js'

/**
 * Register a new user with email and password
 */
export async function registerWithEmail(email: string, password: string, name?: string) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('Email already in use')
  }

  // Hash password
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  })

  // Create session
  const session = await lucia.createSession(user.id, {})

  return { user, session }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.passwordHash) {
    throw new Error('Invalid email or password')
  }

  // Verify password
  const validPassword = await verify(user.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  if (!validPassword) {
    throw new Error('Invalid email or password')
  }

  // Create session
  const session = await lucia.createSession(user.id, {})

  return { user, session }
}

/**
 * Logout - invalidate session
 */
export async function logout(sessionId: string) {
  await lucia.invalidateSession(sessionId)
}
