<script setup lang="ts">
import { useHistory, usePdfExport } from '../composables'

const history = useHistory()
const pdfExport = usePdfExport()
</script>

<template>
  <div class="brick-actionbar">
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
    </div>

    <div class="brick-actionbar__group">
      <button class="brick-actionbar__btn brick-actionbar__btn--primary" @click="pdfExport.exportPdf()">
        Export PDF
      </button>
      <button class="brick-actionbar__btn" @click="pdfExport.openPdf()">
        Preview
      </button>
    </div>
  </div>
</template>

<style scoped>
.brick-actionbar {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.brick-actionbar__group {
  display: flex;
  gap: 6px;
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

.brick-actionbar__btn--primary:hover {
  background: #1565c0;
}
</style>
