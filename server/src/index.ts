import express from 'express'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './router.js'
import { config } from './services/config.js'

const app = express()

// Enable CORS for all routes
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
)

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => {
      return { req }
    },
  })
)

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`)
  console.log(`📡 tRPC endpoint: http://localhost:${config.port}/trpc`)
  console.log(`🌍 Environment: ${config.nodeEnv}`)
})
