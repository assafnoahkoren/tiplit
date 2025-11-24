import { prisma } from '../../lib/prisma.js'

interface StartWorkSessionParams {
  userId: string
  latitude: number
  longitude: number
  endTime: Date
}

interface GetActiveWorkersNearbyParams {
  latitude: number
  longitude: number
  radiusMeters: number
}

export const workSessionService = {
  /**
   * Start a new work session for a user
   * Automatically ends any existing active session before creating new one
   */
  async startWorkSession(params: StartWorkSessionParams) {
    const { userId, latitude, longitude, endTime } = params

    // End any existing active session for this user
    await prisma.$executeRaw`
      UPDATE "WorkSession"
      SET "endTime" = NOW()
      WHERE "userId" = ${userId}
        AND "endTime" > NOW()
    `

    // Create new work session with location
    const session = await prisma.$queryRaw<Array<{
      id: string
      userId: string
      latitude: number
      longitude: number
      startTime: Date
      endTime: Date
      createdAt: Date
      updatedAt: Date
    }>>`
      INSERT INTO "WorkSession" (
        id, "userId", latitude, longitude, location, "startTime", "endTime", "createdAt", "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        ${userId},
        ${latitude},
        ${longitude},
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
        NOW(),
        ${endTime},
        NOW(),
        NOW()
      )
      RETURNING id, "userId", latitude, longitude, "startTime", "endTime", "createdAt", "updatedAt"
    `

    return session[0]
  },

  /**
   * End the current active work session for a user
   */
  async endWorkSession(userId: string) {
    await prisma.workSession.updateMany({
      where: {
        userId,
        endTime: {
          gt: new Date(),
        },
      },
      data: {
        endTime: new Date(),
      },
    })
  },

  /**
   * Get the current active work session for a user
   */
  async getMyActiveSession(userId: string) {
    const now = new Date()
    return prisma.workSession.findFirst({
      where: {
        userId,
        endTime: {
          gt: now,
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    })
  },

  /**
   * Get work session history for a user
   */
  async getMyWorkHistory(userId: string, limit = 20) {
    return prisma.workSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        startTime: 'desc',
      },
      take: limit,
    })
  },

  /**
   * Find active workers within a radius
   * Uses PostGIS for efficient spatial queries
   */
  async getActiveWorkersNearby(params: GetActiveWorkersNearbyParams) {
    const { latitude, longitude, radiusMeters } = params

    const workers = await prisma.$queryRaw<Array<{
      id: string
      userId: string
      latitude: number
      longitude: number
      startTime: Date
      endTime: Date
      distance: number
      userName: string | null
      userAvatar: string | null
    }>>`
      SELECT
        ws.id,
        ws."userId",
        ws.latitude,
        ws.longitude,
        ws."startTime",
        ws."endTime",
        ST_Distance(
          ws.location,
          ST_MakePoint(${longitude}, ${latitude})::geography
        ) as distance,
        u.name as "userName",
        u.avatar as "userAvatar"
      FROM "WorkSession" ws
      INNER JOIN "User" u ON ws."userId" = u.id
      WHERE ws."endTime" > NOW()
        AND ST_DWithin(
          ws.location,
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ${radiusMeters}
        )
      ORDER BY distance ASC
    `

    return workers
  },
}
