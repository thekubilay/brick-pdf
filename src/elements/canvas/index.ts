import type { ElementTypeDefinition } from '../../types/registry'
import { defaultCanvasDrawProps, defaultCanvasDrawStyle } from './canvasDrawDefaults'
import { canvasDrawToPdfmake } from './canvasDrawConverter'
import CanvasDrawRenderer from './CanvasDrawRenderer.vue'
import CanvasDrawPropertyEditor from './CanvasDrawPropertyEditor.vue'

export const canvasDrawDefinition: ElementTypeDefinition = {
  type: 'canvas',
  label: 'Canvas',
  icon: '△',
  isContainer: false,
  defaultProps: defaultCanvasDrawProps,
  defaultStyle: defaultCanvasDrawStyle,
  rendererComponent: CanvasDrawRenderer,
  propertyEditorComponent: CanvasDrawPropertyEditor,
  propertyFields: [
    { key: 'props.width', label: 'Width', section: 'layout', type: 'number', min: 10, max: 1000, step: 10, defaultValue: 200 },
    { key: 'props.height', label: 'Height', section: 'layout', type: 'number', min: 10, max: 1000, step: 10, defaultValue: 100 },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: canvasDrawToPdfmake,
}
