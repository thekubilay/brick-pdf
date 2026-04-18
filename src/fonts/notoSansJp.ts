const FONT_URLS = {
  regular: 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/noto-sans-jp/NotoSansJP_400Regular.ttf',
  bold: 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/noto-sans-jp/NotoSansJP_700Bold.ttf',
}

const FILE_NAMES = {
  regular: 'NotoSansJP-Regular.ttf',
  bold: 'NotoSansJP-Bold.ttf',
}

export const NOTO_SANS_JP_FAMILY = 'NotoSansJP'

export interface NotoSansJpBundle {
  vfs: Record<string, string>
  fonts: Record<string, { normal: string; bold: string; italics: string; bolditalics: string }>
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, Array.from(chunk))
  }
  return btoa(binary)
}

async function fetchFontAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load font ${url}: HTTP ${res.status}`)
  }
  const buf = await res.arrayBuffer()
  return arrayBufferToBase64(buf)
}

let cache: Promise<NotoSansJpBundle> | null = null

export function loadNotoSansJp(): Promise<NotoSansJpBundle> {
  if (cache) return cache
  cache = (async () => {
    const [regular, bold] = await Promise.all([
      fetchFontAsBase64(FONT_URLS.regular),
      fetchFontAsBase64(FONT_URLS.bold),
    ])
    return {
      vfs: {
        [FILE_NAMES.regular]: regular,
        [FILE_NAMES.bold]: bold,
      },
      fonts: {
        [NOTO_SANS_JP_FAMILY]: {
          normal: FILE_NAMES.regular,
          bold: FILE_NAMES.bold,
          italics: FILE_NAMES.regular,
          bolditalics: FILE_NAMES.bold,
        },
      },
    }
  })().catch((err) => {
    cache = null
    throw err
  })
  return cache
}