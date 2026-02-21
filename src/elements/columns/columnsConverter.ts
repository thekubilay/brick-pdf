import type { ElementNode } from '../../types'

export function columnsToPdfmake(node: ElementNode, convertChildren: (children: ElementNode[]) => unknown[]): unknown {
  const result: Record<string, unknown> = {
    columns: convertChildren(node.children),
    columnGap: (node.props.columnGap as number) ?? 10,
  }
  if (node.style.margin) result.margin = node.style.margin
  return result
}
