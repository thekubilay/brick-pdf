import type { ElementStyle } from '../../types'

export function defaultSvgProps(): Record<string, unknown> {
  return {
    svg: '<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#eee" /><text x="50" y="55" text-anchor="middle" font-size="12">SVG</text></svg>',
    width: 200,
    height: 200,
  }
}

export function defaultSvgStyle(): ElementStyle {
  return {}
}
