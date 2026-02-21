import { ref, provide, inject, type InjectionKey, type Ref } from 'vue'
import type { ElementNode } from '../types'
import type { DocumentStore } from './useDocumentStore'
import type { ElementActionsApi } from './useElementActions'

export interface ClipboardApi {
  hasClipboard: Ref<boolean>
  copy(id: string): void
  cut(id: string): void
  paste(parentId?: string | null): void
}

const CLIPBOARD_KEY: InjectionKey<ClipboardApi> = Symbol('brick-pdf-clipboard')

let idCounter = 0
function generateId(): string {
  return `el-${Date.now()}-${++idCounter}`
}

function deepCloneWithNewIds(node: ElementNode): ElementNode {
  return {
    ...node,
    id: generateId(),
    props: structuredClone(node.props),
    style: structuredClone(node.style),
    children: node.children.map(deepCloneWithNewIds),
  }
}

export function createClipboard(store: DocumentStore, actions: ElementActionsApi): ClipboardApi {
  const clipboardNode = ref<ElementNode | null>(null)
  const isCut = ref(false)
  const cutSourceId = ref<string | null>(null)
  const hasClipboard = ref(false)

  function copy(id: string): void {
    const result = store.findNodeById(id)
    if (!result) return
    clipboardNode.value = structuredClone(result.node) as ElementNode
    isCut.value = false
    cutSourceId.value = null
    hasClipboard.value = true
  }

  function cut(id: string): void {
    const result = store.findNodeById(id)
    if (!result) return
    clipboardNode.value = structuredClone(result.node) as ElementNode
    isCut.value = true
    cutSourceId.value = id
    hasClipboard.value = true
  }

  function paste(parentId?: string | null): void {
    if (!clipboardNode.value) return

    if (isCut.value && cutSourceId.value) {
      actions.removeElement(cutSourceId.value)
      isCut.value = false
      cutSourceId.value = null
    }

    const clone = deepCloneWithNewIds(clipboardNode.value)
    const target = parentId ? store.findNodeById(parentId)?.node.children : store.document.content
    if (!target) return
    target.push(clone)

    if (isCut.value) {
      clipboardNode.value = null
      hasClipboard.value = false
    }
  }

  return { hasClipboard, copy, cut, paste }
}

export function provideClipboard(api: ClipboardApi): void {
  provide(CLIPBOARD_KEY, api)
}

export function useClipboard(): ClipboardApi {
  const api = inject(CLIPBOARD_KEY)
  if (!api) {
    throw new Error('useClipboard() requires a BrickPdf ancestor component')
  }
  return api
}
