export interface PropertyFieldDescriptor {
  key: string
  label: string
  section: 'content' | 'style' | 'layout' | 'advanced'
  type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'toggle' | 'margin' | 'slider' | 'file'
  options?: { label: string; value: unknown }[]
  min?: number
  max?: number
  step?: number
  defaultValue?: unknown
}
