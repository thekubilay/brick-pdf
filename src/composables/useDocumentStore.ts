import { reactive, toRaw, provide, inject, type InjectionKey } from 'vue'
import type { DocumentDefinition, ElementNode } from '../types'
import { createDefaultDocument } from '../types'

export interface DocumentStore {
  document: DocumentDefinition
  findNodeById(id: string): { node: ElementNode; parent: ElementNode[]; index: number } | null
  replaceContent(content: ElementNode[]): void
  snapshotContent(): ElementNode[]
}

const DOCUMENT_STORE_KEY: InjectionKey<DocumentStore> = Symbol('brick-pdf-document-store')

export function createDocumentStore(initial?: DocumentDefinition): DocumentStore {
  const document = reactive(initial ?? createDefaultDocument()) as DocumentDefinition

  function findNodeById(
    id: string,
    nodes?: ElementNode[],
  ): { node: ElementNode; parent: ElementNode[]; index: number } | null {
    const searchIn = nodes ?? document.content
    for (let i = 0; i < searchIn.length; i++) {
      const current = searchIn[i]
      if (!current) continue
      if (current.id === id) {
        return { node: current, parent: searchIn, index: i }
      }
      if (current.children.length > 0) {
        const found = findNodeById(id, current.children)
        if (found) return found
      }
    }
    return null
  }

  function replaceContent(content: ElementNode[]): void {
    document.content.splice(0, document.content.length, ...content)
  }

  function snapshotContent(): ElementNode[] {
    return JSON.parse(JSON.stringify(toRaw(document.content))) as ElementNode[]
  }

  return { document, findNodeById, replaceContent, snapshotContent }
}

export function provideDocumentStore(store: DocumentStore): void {
  provide(DOCUMENT_STORE_KEY, store)
}

export function useDocumentStore(): DocumentStore {
  const store = inject(DOCUMENT_STORE_KEY)
  if (!store) {
    throw new Error('useDocumentStore() requires a BrickPdf ancestor component')
  }
  return store
}
