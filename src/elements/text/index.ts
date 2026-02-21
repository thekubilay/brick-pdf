import type { ElementTypeDefinition } from '../../types/registry'
import { defaultTextProps, defaultTextStyle } from './textDefaults'
import { textToPdfmake } from './textConverter'
import TextRenderer from './TextRenderer.vue'
import TextPropertyEditor from './TextPropertyEditor.vue'

export const textDefinition: ElementTypeDefinition = {
  type: 'text',
  label: 'Text',
  icon: 'T',
  isContainer: false,
  defaultProps: defaultTextProps,
  defaultStyle: defaultTextStyle,
  rendererComponent: TextRenderer,
  propertyEditorComponent: TextPropertyEditor,
  propertyFields: [
    { key: 'props.text', label: 'Text Content', section: 'content', type: 'textarea', defaultValue: 'New Text' },
    { key: 'style.fontSize', label: 'Font Size', section: 'style', type: 'number', min: 6, max: 72, step: 1, defaultValue: 12 },
    { key: 'style.bold', label: 'Bold', section: 'style', type: 'toggle', defaultValue: false },
    { key: 'style.italics', label: 'Italic', section: 'style', type: 'toggle', defaultValue: false },
    { key: 'style.color', label: 'Color', section: 'style', type: 'color', defaultValue: '#000000' },
    { key: 'style.alignment', label: 'Alignment', section: 'style', type: 'select', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
      { label: 'Justify', value: 'justify' },
    ], defaultValue: 'left' },
    { key: 'style.lineHeight', label: 'Line Height', section: 'style', type: 'number', min: 0.5, max: 3, step: 0.1 },
    { key: 'style.background', label: 'Background', section: 'style', type: 'color' },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
    { key: 'style.decoration', label: 'Decoration', section: 'advanced', type: 'select', options: [
      { label: 'None', value: undefined },
      { label: 'Underline', value: 'underline' },
      { label: 'Overline', value: 'overline' },
      { label: 'Line Through', value: 'lineThrough' },
    ] },
    { key: 'style.link', label: 'Link URL', section: 'advanced', type: 'text' },
    { key: 'style.opacity', label: 'Opacity', section: 'advanced', type: 'slider', min: 0, max: 1, step: 0.1, defaultValue: 1 },
  ],
  toPdfmake: textToPdfmake,
}
