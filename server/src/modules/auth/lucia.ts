import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { prisma } from '../../lib/prisma.js'
import type { User } from '@prisma/client'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      phone: attributes.phone,
      name: attributes.name,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
    }
  },
})

type UserSessionAttributes = Pick<User, 'email' | 'phone' | 'name' | 'createdAt' | 'updatedAt'>

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: UserSessionAttributes
  }
}
