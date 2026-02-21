import type { ElementStyle } from '../../types'

export function defaultQrProps(): Record<string, unknown> {
  return { data: 'https://example.com', fit: 100 }
}

export function defaultQrStyle(): ElementStyle {
  return {}
}
