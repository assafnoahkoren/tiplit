/**
 * SMS Service Interface
 * Abstracts SMS sending functionality to allow different providers
 */
export interface ISmsService {
  /**
   * Send an SMS message to a phone number
   * @param phoneNumber - The recipient's phone number (E.164 format: +1234567890)
   * @param message - The message to send
   * @returns Promise that resolves when SMS is sent
   */
  sendSms(phoneNumber: string, message: string): Promise<void>

  /**
   * Send an OTP code via SMS
   * @param phoneNumber - The recipient's phone number
   * @param code - The OTP code to send
   * @returns Promise that resolves when SMS is sent
   */
  sendOtp(phoneNumber: string, code: string): Promise<void>
}
