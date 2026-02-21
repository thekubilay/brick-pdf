import type { ElementTypeDefinition } from '../../types/registry'
import { defaultTableProps, defaultTableStyle } from './tableDefaults'
import { tableToPdfmake } from './tableConverter'
import TableRenderer from './TableRenderer.vue'
import TablePropertyEditor from './TablePropertyEditor.vue'

export const tableDefinition: ElementTypeDefinition = {
  type: 'table',
  label: 'Table',
  icon: '▦',
  isContainer: false,
  defaultProps: defaultTableProps,
  defaultStyle: defaultTableStyle,
  rendererComponent: TableRenderer,
  propertyEditorComponent: TablePropertyEditor,
  propertyFields: [
    { key: 'props.headerRows', label: 'Header Rows', section: 'content', type: 'number', min: 0, max: 10, step: 1, defaultValue: 1 },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: tableToPdfmake,
}
