import type { ElementNode } from '../../types'

export function qrToPdfmake(node: ElementNode): unknown {
  const result: Record<string, unknown> = {
    qr: node.props.data as string,
    fit: (node.props.fit as number) ?? 100,
  }
  if (node.style.alignment) result.alignment = node.style.alignment
  if (node.style.margin) result.margin = node.style.margin
  return result
}
