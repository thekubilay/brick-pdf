import type { ElementNode } from '../../types'

export function tableToPdfmake(node: ElementNode): unknown {
  const result: Record<string, unknown> = {
    table: {
      headerRows: node.props.headerRows as number,
      widths: node.props.widths,
      body: (node.props.body as string[][]).map(row =>
        row.map(cell => ({ text: cell }))
      ),
    },
  }
  if (node.style.margin) result.margin = node.style.margin
  return result
}
