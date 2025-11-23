import sharp from 'sharp'

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const AVATAR_SIZE = 800 // 800x800 pixels for avatars - high quality while keeping file size reasonable

/**
 * Calculate the size of a base64 encoded image in bytes
 */
function getBase64Size(base64String: string): number {
  // Remove data URL prefix if present (e.g., "data:image/png;base64,")
  const base64Data = base64String.split(',')[1] || base64String

  // Calculate size: (base64 length * 3) / 4 - padding
  const padding = (base64Data.match(/=/g) || []).length
  return (base64Data.length * 3) / 4 - padding
}

/**
 * Process and optimize an avatar image
 * - Validates size (max 5MB)
 * - Resizes to 300x300
 * - Optimizes/compresses
 * - Returns base64 encoded result
 */
export async function processAvatar(base64Image: string): Promise<string> {
  // Check initial size
  const initialSize = getBase64Size(base64Image)
  if (initialSize > MAX_SIZE_BYTES) {
    throw new Error(`Image size (${(initialSize / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of ${MAX_SIZE_MB}MB`)
  }

  // Extract base64 data (remove data URL prefix if present)
  const matches = base64Image.match(/^data:image\/\w+;base64,(.+)$/)
  const base64Data = matches ? matches[1] : base64Image

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Data, 'base64')

  // Process image with sharp
  const processedBuffer = await sharp(imageBuffer)
    .resize(AVATAR_SIZE, AVATAR_SIZE, {
      fit: 'cover',
      position: 'center',
      kernel: sharp.kernel.lanczos3, // High-quality resizing algorithm
    })
    .jpeg({
      quality: 90,
      progressive: true,
      mozjpeg: true, // Better compression without quality loss
    })
    .toBuffer()

  // Convert back to base64 with data URL prefix
  const optimizedBase64 = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`

  // Check final size
  const finalSize = getBase64Size(optimizedBase64)
  console.log(`Image processed: ${(initialSize / 1024).toFixed(2)}KB -> ${(finalSize / 1024).toFixed(2)}KB`)

  return optimizedBase64
}
