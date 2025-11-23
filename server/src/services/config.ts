import { z } from 'zod'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Define the configuration schema with zod
const configSchema = z.object({
  // Server Configuration
  port: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default('3001'),

  nodeEnv: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Client Configuration
  clientUrl: z
    .string()
    .url()
    .default('http://localhost:5173'),

  // Database Configuration
  databaseUrl: z
    .string()
    .url()
    .describe('PostgreSQL connection string'),

  // Optional: Add more config as needed
  // SMS Configuration (if you add SMS providers later)
  // smsProvider: z.enum(['twilio', 'null']).default('null'),
  // twilioAccountSid: z.string().optional(),
  // twilioAuthToken: z.string().optional(),
  // twilioPhoneNumber: z.string().optional(),
})

// Parse and validate environment variables
function loadConfig() {
  const rawConfig = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT_URL,
    databaseUrl: process.env.DATABASE_URL,
  }

  try {
    return configSchema.parse(rawConfig)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      console.error(JSON.stringify(error.errors, null, 2))
      throw new Error('Invalid environment configuration')
    }
    throw error
  }
}

// Export the validated configuration
export const config = loadConfig()

// Export the type for use throughout the application
export type Config = z.infer<typeof configSchema>

// Helper function to check if running in production
export const isProduction = () => config.nodeEnv === 'production'

// Helper function to check if running in development
export const isDevelopment = () => config.nodeEnv === 'development'

// Helper function to check if running in test
export const isTest = () => config.nodeEnv === 'test'
