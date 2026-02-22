<script setup lang="ts">
import { useDocumentStore } from '../composables'
import type { PageSize } from '../types'

const store = useDocumentStore()

const pageSizes: { label: string; value: PageSize }[] = [
  { label: 'A3', value: 'A3' },
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'Letter', value: 'LETTER' },
  { label: 'Legal', value: 'LEGAL' },
]

function updateMargin(index: number, value: number): void {
  const margins = [...store.document.pageMargins] as [number, number, number, number]
  margins[index] = value
  store.document.pageMargins = margins
}
</script>

<template>
  <div class="brick-doc-bar">
    <div class="brick-doc-bar__field">
      <label>Size</label>
      <select v-model="store.document.pageSize">
        <option v-for="ps in pageSizes" :key="ps.value" :value="ps.value">{{ ps.label }}</option>
      </select>
    </div>

    <div class="brick-doc-bar__field">
      <label>Orientation</label>
      <select v-model="store.document.pageOrientation">
        <option value="portrait">Portrait</option>
        <option value="landscape">Landscape</option>
      </select>
    </div>

    <div class="brick-doc-bar__field brick-doc-bar__field--margins">
      <label>Margins</label>
      <div class="brick-doc-bar__margins">
        <input
          v-for="(placeholder, i) in ['L', 'T', 'R', 'B']"
          :key="i"
          type="number"
          :placeholder="placeholder"
          :title="placeholder"
          :value="store.document.pageMargins[i]"
          @input="updateMargin(i, Number(($event.target as HTMLInputElement).value))"
        />
      </div>
    </div>

    <div class="brick-doc-bar__field">
      <label>Font Size</label>
      <input
        type="number"
        :value="store.document.defaultStyle.fontSize ?? 12"
        min="6"
        max="72"
        @input="store.document.defaultStyle.fontSize = Number(($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<style scoped>
.brick-doc-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.brick-doc-bar__field {
  display: flex;
  align-items: center;
  gap: 4px;
}

.brick-doc-bar__field label {
  font-size: 11px;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.brick-doc-bar__field select,
.brick-doc-bar__field input {
  padding: 3px 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 11px;
  background: white;
}

.brick-doc-bar__field select {
  min-width: 70px;
}

.brick-doc-bar__field input[type="number"] {
  width: 50px;
  text-align: center;
}

.brick-doc-bar__margins {
  display: flex;
  gap: 2px;
}

.brick-doc-bar__margins input {
  width: 36px;
  padding: 3px 2px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 11px;
}
</style>
