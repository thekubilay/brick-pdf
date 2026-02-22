<script setup lang="ts">
import { watch, toRaw } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import type { DocumentDefinition } from '../types'
import { createDefaultDocument } from '../types'
import { registerBuiltinElements } from '../registry/builtinRegistration'
import {
  createDocumentStore,
  provideDocumentStore,
  createSelection,
  provideSelection,
  createHistory,
  provideHistory,
  createElementActions,
  provideElementActions,
  createDragDrop,
  provideDragDrop,
  createPdfExport,
  providePdfExport,
  createClipboard,
  provideClipboard,
  createResize,
  provideResize,
} from '../composables'
import DesignCanvas from './DesignCanvas.vue'
import Toolbar from './Toolbar.vue'
import ActionBar from './ActionBar.vue'

const props = defineProps<{
  modelValue?: DocumentDefinition
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DocumentDefinition]
}>()

registerBuiltinElements()

const store = createDocumentStore(props.modelValue ?? createDefaultDocument())
provideDocumentStore(store)

const selection = createSelection(store)
provideSelection(selection)

const history = createHistory(store)
provideHistory(history)

const actions = createElementActions(store, history)
provideElementActions(actions)

const dragDrop = createDragDrop(store, actions)
provideDragDrop(dragDrop)

const pdfExport = createPdfExport(store)
providePdfExport(pdfExport)

const clipboard = createClipboard(store, actions)
provideClipboard(clipboard)

const resize = createResize(actions)
provideResize(resize)

const keys = useMagicKeys()
const deleteKey = keys['Delete']!
const backspaceKey = keys['Backspace']!

whenever(deleteKey, () => {
  if (!selection.selectedId.value) return
  const active = document.activeElement
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return
  const id = selection.selectedId.value
  selection.deselect()
  actions.removeElement(id)
})

whenever(backspaceKey, () => {
  if (!selection.selectedId.value) return
  const active = document.activeElement
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return
  const id = selection.selectedId.value
  selection.deselect()
  actions.removeElement(id)
})

watch(
  () => store.document,
  () => {
    emit('update:modelValue', JSON.parse(JSON.stringify(toRaw(store.document))) as DocumentDefinition)
  },
  { deep: true },
)
</script>

<template>
  <div class="brick-pdf">
    <ActionBar />
    <div class="brick-pdf__workspace">
      <DesignCanvas />
      <Toolbar />
    </div>
  </div>
</template>

<style scoped>
.brick-pdf {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  color: #333;
  background: #f5f5f5;
}

.brick-pdf__workspace {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
