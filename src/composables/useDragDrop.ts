import { provide, inject, ref, type InjectionKey, type Ref } from 'vue'
import Sortable from 'sortablejs'
import { getElementDefinition } from '../registry/elementRegistry'
import type { ElementActionsApi } from './useElementActions'
import type { DocumentStore } from './useDocumentStore'

export interface DragDropApi {
  initToolbar(el: HTMLElement): Sortable
  initContainer(el: HTMLElement, parentId: string | null): Sortable
  isDragging: Ref<boolean>
}

const DRAG_DROP_KEY: InjectionKey<DragDropApi> = Symbol('brick-pdf-drag-drop')

export function createDragDrop(store: DocumentStore, actions: ElementActionsApi): DragDropApi {
  const isDragging = ref(false)

  function initToolbar(el: HTMLElement): Sortable {
    return Sortable.create(el, {
      group: { name: 'brick-elements', pull: 'clone', put: false },
      sort: false,
      animation: 150,
      onStart() { isDragging.value = true },
      onEnd() { isDragging.value = false },
    })
  }

  function initContainer(el: HTMLElement, parentId: string | null): Sortable {
    return Sortable.create(el, {
      group: { name: 'brick-elements', put: true },
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.5,
      emptyInsertThreshold: 5,
      ghostClass: 'brick-sortable-ghost',
      onStart() { isDragging.value = true },
      onAdd(evt) {
        const itemEl = evt.item
        const elementId = itemEl.dataset.elementId
        const elementType = itemEl.dataset.elementType

        // Target validation (applies to both new + existing moves)
        const rejectByType = (type: string | undefined): boolean => {
          if (!parentId || !type) return false
          const parentResult = store.findNodeById(parentId)
          if (!parentResult) return false
          const parentDef = getElementDefinition(parentResult.node.type)
          return !!(parentDef?.acceptsChildTypes && !parentDef.acceptsChildTypes.includes(type))
        }

        if (elementId) {
          // Existing canvas element moved between containers.
          // Detach Sortable's moved DOM node entirely — Vue will unmount the
          // old vnode (safe on a detached node via parentNode?.removeChild)
          // and freshly mount a new DOM node in the target container.
          itemEl.parentNode?.removeChild(itemEl)

          if (rejectByType(elementType)) return

          actions.moveElement(elementId, parentId, evt.newIndex ?? 0)
          return
        }

        if (!elementType) return

        // New element cloned from the toolbar — drop Sortable's clone,
        // let the state mutation re-render the real component.
        itemEl.parentNode?.removeChild(itemEl)

        if (rejectByType(elementType)) return

        actions.addElement(elementType, parentId, evt.newIndex)
      },
      onEnd(evt) {
        isDragging.value = false
        // Same-parent reorder — cross-container moves are handled in onAdd.
        if (
          evt.from === evt.to &&
          evt.oldIndex !== undefined &&
          evt.newIndex !== undefined &&
          evt.oldIndex !== evt.newIndex &&
          evt.item.dataset.elementId
        ) {
          const children = parentId
            ? store.findNodeById(parentId)?.node.children
            : store.document.content
          if (!children) return

          const moved = children.splice(evt.oldIndex, 1)[0]
          if (moved) children.splice(evt.newIndex, 0, moved)
        }
      },
    })
  }

  return { initToolbar, initContainer, isDragging }
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
