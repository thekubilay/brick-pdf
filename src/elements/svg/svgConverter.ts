import type { ElementNode } from '../../types'

export function svgToPdfmake(node: ElementNode): unknown {
  const result: Record<string, unknown> = {
    svg: node.props.svg as string,
  }
  if (node.props.width) result.width = node.props.width as number
  if (node.props.height) result.height = node.props.height as number
  if (node.style.margin) result.margin = node.style.margin
  if (node.style.alignment) result.alignment = node.style.alignment
  return result
}
