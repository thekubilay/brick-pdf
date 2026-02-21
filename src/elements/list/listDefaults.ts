import type { ElementStyle } from '../../types'

export function defaultListProps(): Record<string, unknown> {
  return { ordered: false, items: ['Item 1', 'Item 2', 'Item 3'] }
}

export function defaultListStyle(): ElementStyle {
  return { fontSize: 12 }
}
