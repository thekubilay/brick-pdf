import type { ElementTypeDefinition } from '../../types/registry'
import { defaultColumnsProps, defaultColumnsStyle } from './columnsDefaults'
import { columnsToPdfmake } from './columnsConverter'
import ColumnsRenderer from './ColumnsRenderer.vue'
import ColumnsPropertyEditor from './ColumnsPropertyEditor.vue'

export const columnsDefinition: ElementTypeDefinition = {
  type: 'columns',
  label: 'Columns',
  icon: '▥',
  isContainer: true,
  acceptsChildTypes: null,
  defaultProps: defaultColumnsProps,
  defaultStyle: defaultColumnsStyle,
  rendererComponent: ColumnsRenderer,
  propertyEditorComponent: ColumnsPropertyEditor,
  propertyFields: [
    { key: 'props.columnGap', label: 'Column Gap', section: 'layout', type: 'number', min: 0, max: 50, step: 1, defaultValue: 10 },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: columnsToPdfmake,
}
