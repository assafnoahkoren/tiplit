const SESSION_KEY = 'sessionId'
const USER_KEY = 'userId'

/**
 * Store session data in localStorage
 */
export function setSession(userId: string, sessionId: string): void {
  localStorage.setItem(USER_KEY, userId)
  localStorage.setItem(SESSION_KEY, sessionId)
}

/**
 * Get session ID from localStorage
 */
export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

/**
 * Get user ID from localStorage
 */
export function getUserId(): string | null {
  return localStorage.getItem(USER_KEY)
}

/**
 * Clear session data from localStorage
 */
export function clearSession(): void {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(SESSION_KEY)
}

/**
 * Check if user is currently authenticated
 */
export async function checkAuth(): Promise<boolean> {
  const sessionId = getSessionId()
  return sessionId !== null
}

/**
 * Check if user is currently authenticated (synchronous)
 */
export function isAuthenticated(): boolean {
  return getSessionId() !== null
}
