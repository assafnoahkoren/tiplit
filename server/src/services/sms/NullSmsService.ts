import type { ISmsService } from './interface.js'

/**
 * Null SMS Service
 * Development/testing implementation that logs SMS instead of sending them
 * Use this until you're ready to integrate a real SMS provider like Twilio
 */
export class NullSmsService implements ISmsService {
  async sendSms(phoneNumber: string, message: string): Promise<void> {
    console.log('📱 [NullSmsService] SMS would be sent:')
    console.log(`   To: ${phoneNumber}`)
    console.log(`   Message: ${message}`)
    console.log('   (Not actually sent - using NullSmsService)')
  }

  async sendOtp(phoneNumber: string, code: string): Promise<void> {
    const message = `Your verification code is: ${code}. Valid for 10 minutes.`
    await this.sendSms(phoneNumber, message)
  }
}
