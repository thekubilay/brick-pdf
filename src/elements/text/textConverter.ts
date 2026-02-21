import type { ElementNode } from '../../types'

export function textToPdfmake(node: ElementNode): unknown {
  const result: Record<string, unknown> = { text: node.props.text as string }
  const style = node.style
  if (style.fontSize) result.fontSize = style.fontSize
  if (style.bold) result.bold = style.bold
  if (style.italics) result.italics = style.italics
  if (style.color) result.color = style.color
  if (style.alignment) result.alignment = style.alignment
  if (style.margin) result.margin = style.margin
  if (style.font) result.font = style.font
  if (style.lineHeight) result.lineHeight = style.lineHeight
  if (style.characterSpacing) result.characterSpacing = style.characterSpacing
  if (style.decoration) result.decoration = style.decoration
  if (style.decorationStyle) result.decorationStyle = style.decorationStyle
  if (style.decorationColor) result.decorationColor = style.decorationColor
  if (style.background) result.background = style.background
  if (style.link) result.link = style.link
  if (style.opacity !== undefined) result.opacity = style.opacity
  return result
}
