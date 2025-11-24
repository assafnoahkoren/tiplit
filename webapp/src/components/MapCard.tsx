import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''

interface MapCardProps {
  latitude: number
  longitude: number
}

// Helper function to create circle coordinates
function createCircleCoordinates(center: number[], radiusInMeters: number, points: number): number[][] {
  const coords = []
  const distanceX = radiusInMeters / (111320 * Math.cos(center[1] * Math.PI / 180))
  const distanceY = radiusInMeters / 110574

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI)
    const x = distanceX * Math.cos(theta)
    const y = distanceY * Math.sin(theta)
    coords.push([center[0] + x, center[1] + y])
  }
  coords.push(coords[0]) // Close the circle
  return coords
}

export function MapCard({ latitude, longitude }: MapCardProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Get the primary color from CSS variable
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim()

    // Convert HSL to hex (primary is "258 89% 57%")
    const hslToHex = (h: number, s: number, l: number) => {
      s /= 100
      l /= 100
      const a = s * Math.min(l, 1 - l)
      const f = (n: number) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }

    const [h, s, l] = primaryColor.split(' ').map(v => parseFloat(v))
    const markerColor = hslToHex(h, s, l)

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [longitude, latitude],
      zoom: 14,
      attributionControl: false,
      interactive: false,
    })

    // Add circle with dashed border after map loads
    map.current.on('load', () => {
      if (!map.current) return

      // Create a circle around the location
      const center = [longitude, latitude]
      const radius = 300 // 300 meters

      // Calculate circle points
      const circle = {
        type: 'FeatureCollection' as const,
        features: [{
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [createCircleCoordinates(center, radius, 64)]
          },
          properties: {}
        }]
      }

      // Add source
      map.current.addSource('circle', {
        type: 'geojson',
        data: circle
      })

      // Add dashed border layer
      map.current.addLayer({
        id: 'circle-border',
        type: 'line',
        source: 'circle',
        paint: {
          'line-color': markerColor,
          'line-width': 2,
          'line-dasharray': [3, 3]
        }
      })

      // Add fill layer with transparency
      map.current.addLayer({
        id: 'circle-fill',
        type: 'fill',
        source: 'circle',
        paint: {
          'fill-color': markerColor,
          'fill-opacity': 0.1
        }
      })
    })

    // Add marker with primary color
    new mapboxgl.Marker({ color: markerColor })
      .setLngLat([longitude, latitude])
      .addTo(map.current)

    // Cleanup
    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [latitude, longitude])

  return (
    <div className="rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-32 [&_.mapboxgl-ctrl-logo]:hidden [&_.mapboxgl-ctrl-attrib]:hidden" />
    </div>
  )
}
