import type { App } from 'vue'
import BrickPdf from './components/BrickPdf.vue'

// Component
export { BrickPdf }

// Types
export type { ElementNode, ElementStyle, ElementPath } from './types'
export type { DocumentDefinition, PageSize } from './types'
export type { ElementTypeDefinition } from './types'
export type { SelectionState } from './types'
export type { HistorySnapshot } from './types'
export type { ToolbarItem } from './types'
export type { PropertyFieldDescriptor } from './types'
export { createDefaultDocument } from './types'

// Registry
export { registerElement, unregisterElement, getElementDefinition, getAllElementDefinitions } from './registry/elementRegistry'

// Composables
export { useDocumentStore } from './composables'
export { useSelection } from './composables'
export { useElementActions } from './composables'
export { useHistory } from './composables'
export { usePdfExport } from './composables'
export { useClipboard } from './composables'
export { useResize } from './composables'
export { useDragDrop } from './composables'

// Plugin
export default {
  install(app: App) {
    app.component('BrickPdf', BrickPdf)
  },
}
