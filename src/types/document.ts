import type { ElementNode, ElementStyle } from './element'

export type PageSize = 'A3' | 'A4' | 'A5' | 'LETTER' | 'LEGAL'

export interface DocumentDefinition {
  pageSize: PageSize
  pageOrientation: 'portrait' | 'landscape'
  pageMargins: [number, number, number, number]
  defaultStyle: ElementStyle
  styles: Record<string, ElementStyle>
  content: ElementNode[]
}

export function createDefaultDocument(): DocumentDefinition {
  return {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      fontSize: 12,
    },
    styles: {},
    content: [],
  }
}
