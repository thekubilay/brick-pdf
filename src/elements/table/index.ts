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
    { key: 'props.layout', label: 'Border Style', section: 'style', type: 'select', options: [
      { label: 'Light Lines', value: 'lightHorizontalLines' },
      { label: 'Grid', value: 'grid' },
      { label: 'Header Only', value: 'headerLineOnly' },
      { label: 'No Borders', value: 'noBorders' },
      { label: 'None', value: 'none' },
    ], defaultValue: 'lightHorizontalLines' },
    { key: 'style.fontSize', label: 'Font Size', section: 'style', type: 'number', min: 6, max: 72, step: 1, defaultValue: 12 },
    { key: 'style.color', label: 'Text Color', section: 'style', type: 'color', defaultValue: '#000000' },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: tableToPdfmake,
}
