import type { ElementNode } from '../../types'

export function pageBreakToPdfmake(_node: ElementNode): unknown {
  return { text: '', pageBreak: 'after' }
}
