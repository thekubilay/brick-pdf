import { provide, inject, type InjectionKey } from 'vue'
import type { ElementNode, ElementStyle } from '../types'
import { getElementDefinition } from '../registry/elementRegistry'
import type { DocumentStore } from './useDocumentStore'
import type { HistoryApi } from './useHistory'

export interface ElementActionsApi {
  addElement(type: string, parentId?: string | null, index?: number): ElementNode | null
  removeElement(id: string): void
  moveElement(id: string, newParentId: string | null, index: number): void
  duplicateElement(id: string): ElementNode | null
  updateProps(id: string, props: Record<string, unknown>): void
  updateStyle(id: string, style: Partial<ElementStyle>): void
}

const ELEMENT_ACTIONS_KEY: InjectionKey<ElementActionsApi> = Symbol('brick-pdf-element-actions')

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

export function createElementActions(store: DocumentStore, history: HistoryApi): ElementActionsApi {
  function addElement(type: string, parentId?: string | null, index?: number): ElementNode | null {
    const def = getElementDefinition(type)
    if (!def) return null

    history.record()

    const node: ElementNode = {
      id: generateId(),
      type,
      props: def.defaultProps(),
      style: def.defaultStyle(),
      children: [],
    }

    const target = parentId ? store.findNodeById(parentId)?.node.children : store.document.content
    if (!target) return null

    const insertIndex = index ?? target.length
    target.splice(insertIndex, 0, node)
    return node
  }

  function removeElement(id: string): void {
    const result = store.findNodeById(id)
    if (!result) return
    history.record()
    result.parent.splice(result.index, 1)
  }

  function moveElement(id: string, newParentId: string | null, index: number): void {
    const result = store.findNodeById(id)
    if (!result) return

    history.record()

    const moved = result.parent.splice(result.index, 1)[0]
    if (!moved) return
    const target = newParentId ? store.findNodeById(newParentId)?.node.children : store.document.content
    if (!target) return
    target.splice(index, 0, moved)
  }

  function duplicateElement(id: string): ElementNode | null {
    const result = store.findNodeById(id)
    if (!result) return null

    history.record()

    const clone = deepCloneWithNewIds(result.node)
    result.parent.splice(result.index + 1, 0, clone)
    return clone
  }

  function updateProps(id: string, props: Record<string, unknown>): void {
    const result = store.findNodeById(id)
    if (!result) return
    history.record()
    Object.assign(result.node.props, props)
  }

  function updateStyle(id: string, style: Partial<ElementStyle>): void {
    const result = store.findNodeById(id)
    if (!result) return
    history.record()
    Object.assign(result.node.style, style)
  }

  return { addElement, removeElement, moveElement, duplicateElement, updateProps, updateStyle }
}

export function provideElementActions(api: ElementActionsApi): void {
  provide(ELEMENT_ACTIONS_KEY, api)
}

export function useElementActions(): ElementActionsApi {
  const api = inject(ELEMENT_ACTIONS_KEY)
  if (!api) {
    throw new Error('useElementActions() requires a BrickPdf ancestor component')
  }
  return api
}
