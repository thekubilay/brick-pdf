import type { ElementNode } from '../../types'

export function tableToPdfmake(node: ElementNode): unknown {
  const body = node.props.body as string[][]
  const result: Record<string, unknown> = {
    table: {
      headerRows: node.props.headerRows as number,
      widths: node.props.widths,
      body: body.map(row =>
        row.map(cell => ({ text: cell }))
      ),
    },
  }
  const layout = node.props.layout as string
  if (layout && layout !== 'none') {
    result.layout = layout
  }
  if (node.style.fontSize) result.fontSize = node.style.fontSize
  if (node.style.color) result.color = node.style.color
  if (node.style.margin) result.margin = node.style.margin
  return result
}
