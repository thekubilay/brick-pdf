import { provide, inject, type InjectionKey } from 'vue'
import Sortable from 'sortablejs'
import { getElementDefinition } from '../registry/elementRegistry'
import type { ElementActionsApi } from './useElementActions'
import type { DocumentStore } from './useDocumentStore'

export interface DragDropApi {
  initToolbar(el: HTMLElement): Sortable
  initContainer(el: HTMLElement, parentId: string | null): Sortable
}

const DRAG_DROP_KEY: InjectionKey<DragDropApi> = Symbol('brick-pdf-drag-drop')

export function createDragDrop(store: DocumentStore, actions: ElementActionsApi): DragDropApi {
  function initToolbar(el: HTMLElement): Sortable {
    return Sortable.create(el, {
      group: { name: 'brick-elements', pull: 'clone', put: false },
      sort: false,
      animation: 150,
    })
  }

  function initContainer(el: HTMLElement, parentId: string | null): Sortable {
    return Sortable.create(el, {
      group: { name: 'brick-elements', put: true },
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      emptyInsertThreshold: 80,
      onAdd(evt) {
        const itemEl = evt.item
        const elementType = itemEl.dataset.elementType
        if (!elementType) return

        // Remove the DOM element that SortableJS added (Vue will re-render)
        itemEl.parentNode?.removeChild(itemEl)

        // Validate acceptsChildTypes
        if (parentId) {
          const parentResult = store.findNodeById(parentId)
          if (parentResult) {
            const parentDef = getElementDefinition(parentResult.node.type)
            if (parentDef?.acceptsChildTypes && !parentDef.acceptsChildTypes.includes(elementType)) {
              return
            }
          }
        }

        actions.addElement(elementType, parentId, evt.newIndex)
      },
      onEnd(evt) {
        if (evt.from === evt.to && evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          const children = parentId
            ? store.findNodeById(parentId)?.node.children
            : store.document.content
          if (!children || evt.oldIndex === evt.newIndex) return

          const moved = children.splice(evt.oldIndex, 1)[0]
          if (moved) children.splice(evt.newIndex, 0, moved)
        }
      },
    })
  }

  return { initToolbar, initContainer }
}

export function provideDragDrop(api: DragDropApi): void {
  provide(DRAG_DROP_KEY, api)
}

export function useDragDrop(): DragDropApi {
  const api = inject(DRAG_DROP_KEY)
  if (!api) {
    throw new Error('useDragDrop() requires a BrickPdf ancestor component')
  }
  return api
}
