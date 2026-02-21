import type { Component } from 'vue'
import type { ElementNode, ElementStyle } from './element'
import type { PropertyFieldDescriptor } from './props'

export interface ElementTypeDefinition {
  type: string
  label: string
  icon: string
  isContainer: boolean
  acceptsChildTypes?: string[] | null
  defaultProps: () => Record<string, unknown>
  defaultStyle: () => ElementStyle
  rendererComponent: Component
  propertyEditorComponent: Component
  propertyFields: PropertyFieldDescriptor[]
  toPdfmake: (node: ElementNode, convertChildren: (children: ElementNode[]) => unknown[]) => unknown
}
