import type { ElementTypeDefinition } from '../../types/registry'
import { defaultPageBreakProps, defaultPageBreakStyle } from './pageBreakDefaults'
import { pageBreakToPdfmake } from './pageBreakConverter'
import PageBreakRenderer from './PageBreakRenderer.vue'
import PageBreakPropertyEditor from './PageBreakPropertyEditor.vue'

export const pageBreakDefinition: ElementTypeDefinition = {
  type: 'pageBreak',
  label: 'Page Break',
  icon: '⏎',
  isContainer: false,
  defaultProps: defaultPageBreakProps,
  defaultStyle: defaultPageBreakStyle,
  rendererComponent: PageBreakRenderer,
  propertyEditorComponent: PageBreakPropertyEditor,
  propertyFields: [],
  toPdfmake: pageBreakToPdfmake,
}
