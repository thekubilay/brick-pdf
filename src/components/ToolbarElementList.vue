<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getAllElementDefinitions } from '../registry/elementRegistry'
import { useDragDrop } from '../composables'
import Sortable from 'sortablejs'

const el = ref<HTMLElement | null>(null)
let sortable: Sortable | null = null
const dragDrop = useDragDrop()
const definitions = getAllElementDefinitions()

onMounted(() => {
  if (el.value) {
    sortable = dragDrop.initToolbar(el.value)
  }
})

onBeforeUnmount(() => {
  sortable?.destroy()
})
</script>

<template>
  <div ref="el" class="brick-element-list">
    <div
      v-for="def in definitions"
      :key="def.type"
      class="brick-element-list__item"
      :data-element-type="def.type"
    >
      <span class="brick-element-list__icon">{{ def.icon }}</span>
      <span class="brick-element-list__label">{{ def.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.brick-element-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.brick-element-list__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: grab;
  font-size: 12px;
  user-select: none;
  transition: background 0.15s, box-shadow 0.15s;
}

.brick-element-list__item:hover {
  background: #e3f2fd;
  border-color: #90caf9;
}

.brick-element-list__item:active {
  cursor: grabbing;
}

.brick-element-list__icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.brick-element-list__label {
  font-weight: 500;
}
</style>
