import { NullSmsService } from './NullSmsService.js'
import type { ISmsService } from './interface.js'

/**
 * SMS Service Instance
 *
 * To switch to Twilio later:
 * 1. Create TwilioSmsService.ts that implements ISmsService
 * 2. Change this line to: export const smsService: ISmsService = new TwilioSmsService()
 */
export const smsService: ISmsService = new NullSmsService()

// Re-export the interface for convenience
export type { ISmsService } from './interface.js'
