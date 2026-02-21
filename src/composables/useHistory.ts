import { ref, computed, provide, inject, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import type { ElementNode } from '../types'
import type { DocumentStore } from './useDocumentStore'

export interface HistoryApi {
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  record(): void
  undo(): void
  redo(): void
}

const HISTORY_KEY: InjectionKey<HistoryApi> = Symbol('brick-pdf-history')
const MAX_SNAPSHOTS = 50

export function createHistory(store: DocumentStore): HistoryApi {
  const undoStack: Ref<ElementNode[][]> = ref([])
  const redoStack: Ref<ElementNode[][]> = ref([])
  let lastRecordTime = 0

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  function record(): void {
    const now = Date.now()
    if (now - lastRecordTime < 100) return
    lastRecordTime = now

    const snapshot = store.snapshotContent()
    undoStack.value.push(snapshot)
    if (undoStack.value.length > MAX_SNAPSHOTS) {
      undoStack.value.shift()
    }
    redoStack.value = []
  }

  function undo(): void {
    const snapshot = undoStack.value.pop()
    if (!snapshot) return
    redoStack.value.push(store.snapshotContent())
    store.replaceContent(snapshot)
  }

  function redo(): void {
    const snapshot = redoStack.value.pop()
    if (!snapshot) return
    undoStack.value.push(store.snapshotContent())
    store.replaceContent(snapshot)
  }

  return { canUndo, canRedo, record, undo, redo }
}

export function provideHistory(api: HistoryApi): void {
  provide(HISTORY_KEY, api)
}

export function useHistory(): HistoryApi {
  const api = inject(HISTORY_KEY)
  if (!api) {
    throw new Error('useHistory() requires a BrickPdf ancestor component')
  }
  return api
}
