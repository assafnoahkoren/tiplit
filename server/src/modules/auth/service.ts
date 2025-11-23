import { hash, verify } from '@node-rs/argon2'
import { prisma } from '../../lib/prisma.js'
import { lucia } from './lucia.js'
import { sendOtp, verifyOtp } from './otpService.js'

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

/**
 * Get current user from session
 */
export async function getCurrentUser(sessionId: string) {
  // Validate session and get user
  const { session, user } = await lucia.validateSession(sessionId)

  if (!session || !user) {
    throw new Error('Invalid or expired session')
  }

  // Fetch full user data from database (excluding password hash)
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!fullUser) {
    throw new Error('User not found')
  }

  return fullUser
}

/**
 * Request OTP for phone number (for registration or login)
 */
export async function requestPhoneOtp(phoneNumber: string) {
  await sendOtp(phoneNumber)
  return { success: true }
}

/**
 * Verify OTP and register new user with phone number
 */
export async function registerWithPhone(phoneNumber: string, code: string, name?: string) {
  // Verify OTP
  const isValid = await verifyOtp(phoneNumber, code)
  if (!isValid) {
    throw new Error('Invalid or expired OTP code')
  }

  // Check if phone number already exists
  const existingUser = await prisma.user.findUnique({
    where: { phone: phoneNumber },
  })

  if (existingUser) {
    throw new Error('Phone number already in use')
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      phone: phoneNumber,
      name,
    },
  })

  // Create session
  const session = await lucia.createSession(user.id, {})

  return { user, session }
}

/**
 * Verify OTP and login with phone number
 * Auto-creates user if they don't exist (passwordless auth pattern)
 */
export async function loginWithPhone(phoneNumber: string, code: string) {
  // Verify OTP
  const isValid = await verifyOtp(phoneNumber, code)
  if (!isValid) {
    throw new Error('Invalid or expired OTP code')
  }

  // Find or create user by phone number
  let user = await prisma.user.findUnique({
    where: { phone: phoneNumber },
  })

  if (!user) {
    // Auto-create user on first login (passwordless auth)
    user = await prisma.user.create({
      data: {
        phone: phoneNumber,
      },
    })
  }

  // Create session
  const session = await lucia.createSession(user.id, {})

  return { user, session }
}
