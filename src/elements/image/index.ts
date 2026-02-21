import type { ElementTypeDefinition } from '../../types/registry'
import { defaultImageProps, defaultImageStyle } from './imageDefaults'
import { imageToPdfmake } from './imageConverter'
import ImageRenderer from './ImageRenderer.vue'
import ImagePropertyEditor from './ImagePropertyEditor.vue'

export const imageDefinition: ElementTypeDefinition = {
  type: 'image',
  label: 'Image',
  icon: '🖼',
  isContainer: false,
  defaultProps: defaultImageProps,
  defaultStyle: defaultImageStyle,
  rendererComponent: ImageRenderer,
  propertyEditorComponent: ImagePropertyEditor,
  propertyFields: [
    { key: 'props.src', label: 'Image (Base64)', section: 'content', type: 'file' },
    { key: 'props.width', label: 'Width', section: 'layout', type: 'number', min: 10, max: 1000, step: 10, defaultValue: 200 },
    { key: 'props.height', label: 'Height', section: 'layout', type: 'number', min: 10, max: 1000, step: 10, defaultValue: 150 },
    { key: 'style.alignment', label: 'Alignment', section: 'style', type: 'select', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ] },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
    { key: 'style.opacity', label: 'Opacity', section: 'advanced', type: 'slider', min: 0, max: 1, step: 0.1, defaultValue: 1 },
  ],
  toPdfmake: imageToPdfmake,
}
