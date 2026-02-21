import { registerElement } from './elementRegistry'
import { textDefinition } from '../elements/text'
import { stackDefinition } from '../elements/stack'
import { columnsDefinition } from '../elements/columns'
import { tableDefinition } from '../elements/table'
import { imageDefinition } from '../elements/image'
import { listDefinition } from '../elements/list'
import { qrDefinition } from '../elements/qr'
import { svgDefinition } from '../elements/svg'
import { canvasDrawDefinition } from '../elements/canvas'
import { pageBreakDefinition } from '../elements/pageBreak'

let registered = false

export function registerBuiltinElements(): void {
  if (registered) return
  registered = true

  registerElement(textDefinition)
  registerElement(stackDefinition)
  registerElement(columnsDefinition)
  registerElement(tableDefinition)
  registerElement(imageDefinition)
  registerElement(listDefinition)
  registerElement(qrDefinition)
  registerElement(svgDefinition)
  registerElement(canvasDrawDefinition)
  registerElement(pageBreakDefinition)
}
