<script setup lang="ts">
import { ref } from 'vue'
import { useHistory, usePdfExport, useSelection, useElementActions, useDocumentStore } from '../composables'
import type { DocumentDefinition } from '../types'

const history = useHistory()
const pdfExport = usePdfExport()
const selection = useSelection()
const actions = useElementActions()
const store = useDocumentStore()

const documentName = ref('document')
const fileInput = ref<HTMLInputElement | null>(null)

function deleteSelected(): void {
  const id = selection.selectedId.value
  if (!id) return
  selection.deselect()
  actions.removeElement(id)
}

function exportPdf(): void {
  const name = documentName.value.trim() || 'document'
  const filename = name.endsWith('.pdf') ? name : name + '.pdf'
  pdfExport.exportPdf(filename)
}

function exportJson(): void {
  const doc = store.exportDocument()
  const json = JSON.stringify(doc, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const name = documentName.value.trim() || 'document'
  a.href = url
  a.download = name.endsWith('.json') ? name : name + '.json'
  a.click()
  URL.revokeObjectURL(url)
}

function importJson(): void {
  fileInput.value?.click()
}

function onFileSelected(e: Event): void {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const doc = JSON.parse(reader.result as string) as DocumentDefinition
      if (!doc.content || !doc.pageSize) {
        alert('Invalid brick-pdf JSON file.')
        return
      }
      selection.deselect()
      store.loadDocument(doc)
    } catch {
      alert('Failed to parse JSON file.')
    }
  }
  reader.readAsText(file)
  // Reset so same file can be re-imported
  input.value = ''
}
</script>

<template>
  <div class="brick-actionbar">
    <div class="brick-actionbar__group">
      <input
        v-model="documentName"
        class="brick-actionbar__name"
        type="text"
        placeholder="Document name"
        title="Document name (used for export filename)"
      />
    </div>

    <div class="brick-actionbar__group">
      <button
        class="brick-actionbar__btn"
        :disabled="!history.canUndo.value"
        title="Undo"
        @click="history.undo()"
      >
        Undo
      </button>
      <button
        class="brick-actionbar__btn"
        :disabled="!history.canRedo.value"
        title="Redo"
        @click="history.redo()"
      >
        Redo
      </button>
      <button
        class="brick-actionbar__btn brick-actionbar__btn--danger"
        :disabled="!selection.selectedId.value"
        title="Delete selected element"
        @click="deleteSelected"
      >
        Delete
      </button>
    </div>

    <div class="brick-actionbar__group">
      <button class="brick-actionbar__btn" title="Import JSON" @click="importJson">
        Import JSON
      </button>
      <button class="brick-actionbar__btn" title="Export JSON" @click="exportJson">
        Export JSON
      </button>
      <button class="brick-actionbar__btn brick-actionbar__btn--primary" @click="exportPdf">
        Export PDF
      </button>
      <button class="brick-actionbar__btn" @click="pdfExport.openPdf()">
        Preview
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="onFileSelected"
    />
  </div>
</template>

<style scoped>
.brick-actionbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  gap: 12px;
}

.brick-actionbar__group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.brick-actionbar__name {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  width: 200px;
  outline: none;
  transition: border-color 0.15s;
}

.brick-actionbar__name:focus {
  border-color: #1976d2;
}

.brick-actionbar__btn {
  padding: 6px 14px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.brick-actionbar__btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.brick-actionbar__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.brick-actionbar__btn--primary {
  background: #1976d2;
  color: white;
  border-color: #1565c0;
}

.brick-actionbar__btn--primary:hover:not(:disabled) {
  background: #1565c0;
}

.brick-actionbar__btn--danger {
  background: #fff;
  color: #d32f2f;
  border-color: #d32f2f;
}

.brick-actionbar__btn--danger:hover:not(:disabled) {
  background: #d32f2f;
  color: white;
}
</style>
