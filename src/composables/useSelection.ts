import { ref, computed, provide, inject, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import type { ElementNode } from '../types'
import type { DocumentStore } from './useDocumentStore'

export interface SelectionApi {
  selectedId: Ref<string | null>
  selectedNode: ComputedRef<ElementNode | null>
  select(id: string): void
  deselect(): void
}

const SELECTION_KEY: InjectionKey<SelectionApi> = Symbol('brick-pdf-selection')

export function createSelection(store: DocumentStore): SelectionApi {
  const selectedId = ref<string | null>(null)

  const selectedNode = computed<ElementNode | null>(() => {
    if (!selectedId.value) return null
    const result = store.findNodeById(selectedId.value)
    return result?.node ?? null
  })

  function select(id: string): void {
    selectedId.value = id
  }

  function deselect(): void {
    selectedId.value = null
  }

  return { selectedId, selectedNode, select, deselect }
}

export function provideSelection(api: SelectionApi): void {
  provide(SELECTION_KEY, api)
}

export function useSelection(): SelectionApi {
  const api = inject(SELECTION_KEY)
  if (!api) {
    throw new Error('useSelection() requires a BrickPdf ancestor component')
  }
  return api
}
