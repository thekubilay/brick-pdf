import type { ElementTypeDefinition } from '../../types/registry'
import { defaultStackProps, defaultStackStyle } from './stackDefaults'
import { stackToPdfmake } from './stackConverter'
import StackRenderer from './StackRenderer.vue'
import StackPropertyEditor from './StackPropertyEditor.vue'

export const stackDefinition: ElementTypeDefinition = {
  type: 'stack',
  label: 'Stack',
  icon: '☰',
  isContainer: true,
  acceptsChildTypes: null,
  defaultProps: defaultStackProps,
  defaultStyle: defaultStackStyle,
  rendererComponent: StackRenderer,
  propertyEditorComponent: StackPropertyEditor,
  propertyFields: [
    { key: 'style.fillColor', label: 'Fill Color', section: 'style', type: 'color' },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: stackToPdfmake,
}
