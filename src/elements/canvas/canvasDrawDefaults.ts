import type { ElementStyle } from '../../types'

export interface CanvasCommand {
  type: 'rect' | 'line' | 'ellipse' | 'polyline'
  x?: number
  y?: number
  w?: number
  h?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  r1?: number
  r2?: number
  color?: string
  lineWidth?: number
  lineColor?: string
  points?: { x: number; y: number }[]
}

export function defaultCanvasDrawProps(): Record<string, unknown> {
  return {
    commands: [
      { type: 'rect', x: 0, y: 0, w: 200, h: 100, color: '#eeeeee' },
    ] as CanvasCommand[],
    width: 200,
    height: 100,
  }
}

export function defaultCanvasDrawStyle(): ElementStyle {
  return {}
}
