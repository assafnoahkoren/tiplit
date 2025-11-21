import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../../server/src/router.js'
import { getSessionId } from './auth'

/**
 * Create tRPC React hooks
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * Create tRPC client with automatic session handling
 */
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_TRPC_URL,
      headers() {
        const sessionId = getSessionId()
        return {
          authorization: sessionId ? `Bearer ${sessionId}` : '',
        }
      },
    }),
  ],
})
