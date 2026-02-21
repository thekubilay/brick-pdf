import type { ElementTypeDefinition } from '../../types/registry'
import { defaultSvgProps, defaultSvgStyle } from './svgDefaults'
import { svgToPdfmake } from './svgConverter'
import SvgRenderer from './SvgRenderer.vue'
import SvgPropertyEditor from './SvgPropertyEditor.vue'

export const svgDefinition: ElementTypeDefinition = {
  type: 'svg',
  label: 'SVG',
  icon: '◇',
  isContainer: false,
  defaultProps: defaultSvgProps,
  defaultStyle: defaultSvgStyle,
  rendererComponent: SvgRenderer,
  propertyEditorComponent: SvgPropertyEditor,
  propertyFields: [
    { key: 'props.svg', label: 'SVG Markup', section: 'content', type: 'textarea' },
    { key: 'props.width', label: 'Width', section: 'layout', type: 'number', min: 10, max: 1000, step: 10, defaultValue: 200 },
    { key: 'props.height', label: 'Height', section: 'layout', type: 'number', min: 10, max: 1000, step: 10, defaultValue: 200 },
    { key: 'style.alignment', label: 'Alignment', section: 'style', type: 'select', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ] },
    { key: 'style.margin', label: 'Margin', section: 'layout', type: 'margin', defaultValue: [0, 0, 0, 0] },
  ],
  toPdfmake: svgToPdfmake,
}
