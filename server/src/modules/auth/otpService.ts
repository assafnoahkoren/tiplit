import { prisma } from '../../lib/prisma.js'
import { smsService } from '../../services/sms/index.js'

const OTP_LENGTH = 4
const OTP_EXPIRY_MINUTES = 10
const MAX_ATTEMPTS = 5

/**
 * Generate a random OTP code
 */
function generateOtpCode(): string {
  const min = Math.pow(10, OTP_LENGTH - 1)
  const max = Math.pow(10, OTP_LENGTH) - 1
  return Math.floor(min + Math.random() * (max - min + 1)).toString()
}

/**
 * Send OTP to phone number
 * Reuses existing valid OTP if available, otherwise creates a new one
 */
export async function sendOtp(phoneNumber: string): Promise<void> {
  // Check for existing valid OTP
  const existingOtp = await prisma.otp.findFirst({
    where: {
      phoneNumber,
      verified: false,
      expiresAt: {
        gt: new Date(), // Not expired
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  let code: string

  if (existingOtp) {
    // Reuse existing OTP code for better UX
    code = existingOtp.code
    console.log(`📱 Reusing existing OTP for ${phoneNumber}`)
  } else {
    // Invalidate any old expired/used OTPs
    await prisma.otp.updateMany({
      where: {
        phoneNumber,
        verified: false,
      },
      data: {
        verified: true, // Mark as used to prevent reuse
      },
    })

    // Generate new OTP
    code = generateOtpCode()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    // Store OTP in database
    await prisma.otp.create({
      data: {
        phoneNumber,
        code,
        expiresAt,
      },
    })

    console.log(`📱 Generated new OTP for ${phoneNumber}`)
  }

  // Send OTP via SMS (whether new or existing)
  await smsService.sendOtp(phoneNumber, code)
}

/**
 * Verify OTP code for a phone number
 * Returns true if valid, false otherwise
 */
export async function verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
  // Find the most recent unverified OTP for this phone number
  const otp = await prisma.otp.findFirst({
    where: {
      phoneNumber,
      verified: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!otp) {
    return false
  }

  // Check if OTP has expired
  if (new Date() > otp.expiresAt) {
    return false
  }

  // Check if max attempts exceeded
  if (otp.attempts >= MAX_ATTEMPTS) {
    return false
  }

  // Increment attempt counter
  await prisma.otp.update({
    where: { id: otp.id },
    data: { attempts: otp.attempts + 1 },
  })

  // Check if code matches
  if (otp.code !== code) {
    return false
  }

  // Mark OTP as verified
  await prisma.otp.update({
    where: { id: otp.id },
    data: { verified: true },
  })

  return true
}

/**
 * Clean up expired OTPs
 * Should be run periodically (e.g., via cron job)
 */
export async function cleanupExpiredOtps(): Promise<void> {
  await prisma.otp.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}
