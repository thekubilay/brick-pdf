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
  <div class="brick-doc-settings">
    <div class="brick-doc-settings__field">
      <label>Page Size</label>
      <select v-model="store.document.pageSize">
        <option v-for="ps in pageSizes" :key="ps.value" :value="ps.value">{{ ps.label }}</option>
      </select>
    </div>

    <div class="brick-doc-settings__field">
      <label>Orientation</label>
      <select v-model="store.document.pageOrientation">
        <option value="portrait">Portrait</option>
        <option value="landscape">Landscape</option>
      </select>
    </div>

    <div class="brick-doc-settings__field">
      <label>Margins (L / T / R / B)</label>
      <div class="brick-doc-settings__margins">
        <input
          v-for="(_, i) in 4"
          :key="i"
          type="number"
          :value="store.document.pageMargins[i]"
          @input="updateMargin(i, Number(($event.target as HTMLInputElement).value))"
        />
      </div>
    </div>

    <div class="brick-doc-settings__field">
      <label>Default Font Size</label>
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
.brick-doc-settings__field {
  margin-bottom: 10px;
}

.brick-doc-settings__field label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 3px;
}

.brick-doc-settings__field select,
.brick-doc-settings__field input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  box-sizing: border-box;
}

.brick-doc-settings__margins {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 4px;
}

.brick-doc-settings__margins input {
  text-align: center;
  padding: 4px;
}
</style>
