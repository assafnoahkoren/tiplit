import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Country } from "react-phone-number-input"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cache for the detected country to avoid multiple API calls
let cachedCountry: Country | null = null

export async function getDefaultCountry(): Promise<Country> {
  // Return cached value if available
  if (cachedCountry) {
    return cachedCountry
  }

  try {
    // Use IP-based geolocation to get the user's actual country
    // Using ipwho.is - no rate limits, no API key required
    const response = await fetch('https://ipwho.is/', {
      headers: { 'Accept': 'application/json' }
    })

    if (response.ok) {
      const data = await response.json()

      if (data.success !== false && data.country_code) {
        const countryCode = data.country_code as Country

        if (countryCode && countryCode.length === 2) {
          cachedCountry = countryCode
          return countryCode
        }
      }
    }
  } catch (error) {
    console.warn('Failed to detect country from IP:', error)
  }

  // Fallback to US
  cachedCountry = 'US'
  return 'US'
}
