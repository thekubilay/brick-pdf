import { reactive, toRaw, provide, inject, type InjectionKey } from 'vue'
import type { DocumentDefinition, ElementNode } from '../types'
import { createDefaultDocument } from '../types'


export interface DocumentStore {
  document: DocumentDefinition
  findNodeById(id: string): { node: ElementNode; parent: ElementNode[]; index: number } | null
  replaceContent(content: ElementNode[]): void
  snapshotContent(): ElementNode[]
  loadDocument(def: DocumentDefinition): void
  exportDocument(): DocumentDefinition
}

const DOCUMENT_STORE_KEY: InjectionKey<DocumentStore> = Symbol('brick-pdf-document-store')

function normalizeDocument(doc: DocumentDefinition): DocumentDefinition {
  const defaults = createDefaultDocument()
  return {
    pageSize: doc.pageSize ?? defaults.pageSize,
    pageOrientation: doc.pageOrientation ?? defaults.pageOrientation,
    pageMargins: doc.pageMargins ?? defaults.pageMargins,
    defaultStyle: doc.defaultStyle ?? defaults.defaultStyle,
    styles: doc.styles ?? defaults.styles,
    content: doc.content ?? defaults.content,
  }
}

function normalizeNode(node: ElementNode): ElementNode {
  node.props = node.props ?? {}
  node.style = node.style ?? {}
  node.children = node.children ?? []
  for (const c of node.children) normalizeNode(c)
  return node
}

export function createDocumentStore(initial?: DocumentDefinition): DocumentStore {
  const normalized = initial ? normalizeDocument(initial) : createDefaultDocument()
  for (const n of normalized.content) normalizeNode(n)
  const document = reactive(normalized) as DocumentDefinition

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

  function loadDocument(def: DocumentDefinition): void {
    const n = normalizeDocument(def)
    for (const node of n.content) normalizeNode(node)
    document.pageSize = n.pageSize
    document.pageOrientation = n.pageOrientation
    document.pageMargins = n.pageMargins
    document.defaultStyle = n.defaultStyle
    document.styles = n.styles
    document.content.splice(0, document.content.length, ...n.content)
  }

  function exportDocument(): DocumentDefinition {
    return JSON.parse(JSON.stringify(toRaw(document))) as DocumentDefinition
  }

  return { document, findNodeById, replaceContent, snapshotContent, loadDocument, exportDocument }
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
