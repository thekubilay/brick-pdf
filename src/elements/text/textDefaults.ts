import type { ElementStyle } from '../../types'

export function defaultTextProps(): Record<string, unknown> {
  return { text: 'New Text' }
}

export function defaultTextStyle(): ElementStyle {
  return { fontSize: 12 }
}
