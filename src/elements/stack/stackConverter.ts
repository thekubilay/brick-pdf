import type { ElementNode } from '../../types'

export function stackToPdfmake(node: ElementNode, convertChildren: (children: ElementNode[]) => unknown[]): unknown {
  const result: Record<string, unknown> = {
    stack: convertChildren(node.children),
  }
  if (node.style.margin) result.margin = node.style.margin
  if (node.style.fillColor) result.fillColor = node.style.fillColor
  return result
}
