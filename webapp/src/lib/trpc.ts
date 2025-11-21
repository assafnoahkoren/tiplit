import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../../server/src/router.js'

/**
 * Create tRPC React hooks
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * Create tRPC client
 */
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_TRPC_URL,
    }),
  ],
})
