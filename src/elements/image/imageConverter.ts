import type { ElementNode } from '../../types'

export function imageToPdfmake(node: ElementNode): unknown {
  const result: Record<string, unknown> = {
    image: node.props.src as string,
  }
  if (node.props.width) result.width = node.props.width as number
  if (node.props.height) result.height = node.props.height as number
  if (node.props.fit) result.fit = node.props.fit
  if (node.style.margin) result.margin = node.style.margin
  if (node.style.alignment) result.alignment = node.style.alignment
  if (node.style.opacity !== undefined) result.opacity = node.style.opacity
  return result
}
