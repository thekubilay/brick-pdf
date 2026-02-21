export interface ElementNode {
  id: string
  type: string
  props: Record<string, unknown>
  style: ElementStyle
  children: ElementNode[]
}

export interface ElementStyle {
  font?: string
  fontSize?: number
  bold?: boolean
  italics?: boolean
  color?: string
  background?: string
  fillColor?: string
  alignment?: 'left' | 'right' | 'center' | 'justify'
  margin?: [number, number, number, number]
  lineHeight?: number
  characterSpacing?: number
  decoration?: 'underline' | 'overline' | 'lineThrough'
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy'
  decorationColor?: string
  opacity?: number
  link?: string
  linkToPage?: number
  width?: number | string
  height?: number
}

export type ElementPath = number[]
