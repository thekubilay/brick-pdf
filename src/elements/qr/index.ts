import type { ElementTypeDefinition } from '../../types/registry'
import { defaultQrProps, defaultQrStyle } from './qrDefaults'
import { qrToPdfmake } from './qrConverter'
import QrRenderer from './QrRenderer.vue'
import QrPropertyEditor from './QrPropertyEditor.vue'

export const qrDefinition: ElementTypeDefinition = {
  type: 'qr',
  label: 'QR Code',
  icon: '⊞',
  isContainer: false,
  defaultProps: defaultQrProps,
  defaultStyle: defaultQrStyle,
  rendererComponent: QrRenderer,
  propertyEditorComponent: QrPropertyEditor,
  propertyFields: [
    { key: 'props.data', label: 'QR Data', section: 'content', type: 'text', defaultValue: 'https://example.com' },
    { key: 'props.fit', label: 'Size (px)', section: 'layout', type: 'number', min: 50, max: 500, step: 10, defaultValue: 100 },
    { key: 'style.alignment', label: 'Alignment', section: 'style', type: 'select', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ] },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: qrToPdfmake,
}
