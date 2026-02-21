import type { ElementStyle } from '../../types'

export function defaultImageProps(): Record<string, unknown> {
  return { src: '', width: 200, height: 150, fit: null }
}

export function defaultImageStyle(): ElementStyle {
  return {}
}
