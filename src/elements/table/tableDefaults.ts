import type { ElementStyle } from '../../types'

export function defaultTableProps(): Record<string, unknown> {
  return {
    headerRows: 1,
    widths: ['*', '*'],
    body: [
      ['Header 1', 'Header 2'],
      ['Cell 1', 'Cell 2'],
    ],
  }
}

export function defaultTableStyle(): ElementStyle {
  return {}
}
