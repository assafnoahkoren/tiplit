/**
 * Fake authentication check function
 * Simulates an async auth check by waiting 200ms
 * @returns Promise that resolves to true (authenticated)
 */
export async function checkAuth(): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return true
}

/**
 * Check if user is currently authenticated
 * For now, always returns true after a delay
 */
export function isAuthenticated(): boolean {
  // In a real app, this would check localStorage, cookies, or auth state
  return true
}
