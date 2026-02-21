import type { ElementNode } from '../../types'

export function canvasDrawToPdfmake(node: ElementNode): unknown {
  const result: Record<string, unknown> = {
    canvas: node.props.commands,
  }
  if (node.style.margin) result.margin = node.style.margin
  return result
}
