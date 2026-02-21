import type { ElementTypeDefinition } from '../../types/registry'
import { defaultListProps, defaultListStyle } from './listDefaults'
import { listToPdfmake } from './listConverter'
import ListRenderer from './ListRenderer.vue'
import ListPropertyEditor from './ListPropertyEditor.vue'

export const listDefinition: ElementTypeDefinition = {
  type: 'list',
  label: 'List',
  icon: '☰',
  isContainer: false,
  defaultProps: defaultListProps,
  defaultStyle: defaultListStyle,
  rendererComponent: ListRenderer,
  propertyEditorComponent: ListPropertyEditor,
  propertyFields: [
    { key: 'props.ordered', label: 'Ordered', section: 'content', type: 'toggle', defaultValue: false },
    { key: 'props.items', label: 'Items', section: 'content', type: 'textarea', defaultValue: 'Item 1\nItem 2\nItem 3' },
    { key: 'style.fontSize', label: 'Font Size', section: 'style', type: 'number', min: 6, max: 72, step: 1, defaultValue: 12 },
    { key: 'style.color', label: 'Color', section: 'style', type: 'color', defaultValue: '#000000' },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: listToPdfmake,
}
