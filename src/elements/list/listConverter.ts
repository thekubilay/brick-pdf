import type { ElementNode } from '../../types'

export function listToPdfmake(node: ElementNode): unknown {
  const items = node.props.items as string[]
  const ordered = node.props.ordered as boolean
  const result: Record<string, unknown> = ordered ? { ol: items } : { ul: items }
  if (node.style.fontSize) result.fontSize = node.style.fontSize
  if (node.style.color) result.color = node.style.color
  if (node.style.margin) result.margin = node.style.margin
  return result
}
