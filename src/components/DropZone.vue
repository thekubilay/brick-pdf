<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useDragDrop } from '../composables'
import Sortable from 'sortablejs'

const props = defineProps<{
  parentId: string | null
  layout?: 'vertical' | 'horizontal'
}>()

const el = ref<HTMLElement | null>(null)
let sortable: Sortable | null = null
const dragDrop = useDragDrop()
const { isDragging } = dragDrop

onMounted(() => {
  if (el.value) {
    sortable = dragDrop.initContainer(el.value, props.parentId)
  }
})

onBeforeUnmount(() => {
  sortable?.destroy()
})
</script>

<template>
  <div ref="el" class="brick-dropzone" :class="{ 'brick-dropzone--horizontal': layout === 'horizontal', 'brick-dropzone--drag-active': isDragging && layout === 'horizontal' }">
    <slot />
    <div v-if="!$slots.default" class="brick-dropzone__empty">
      Drop elements here
    </div>
  </div>
</template>

<style scoped>
.brick-dropzone {
  min-height: 60px;
}

.brick-dropzone--horizontal {
  display: flex;
  flex-direction: row;
  min-height: 80px;
}

.brick-dropzone--horizontal > :deep(*) {
  flex: 1;
  min-width: 0;
}

.brick-dropzone--horizontal.brick-dropzone--drag-active > :deep(*) {
  flex: 0 1 auto;
  max-width: 35%;
  transition: max-width 0.2s ease;
}

.brick-dropzone--horizontal > :deep(.brick-sortable-ghost) {
  flex: 1;
  max-width: none;
  min-height: 40px;
  border: 2px dashed #1976d2;
  border-radius: 4px;
  background: rgba(25, 118, 210, 0.08);
  opacity: 0.4;
  overflow: hidden;
}

.brick-dropzone:not(.brick-dropzone--horizontal) > :deep(.brick-sortable-ghost) {
  min-height: 40px;
  border: 2px dashed #1976d2;
  border-radius: 4px;
  background: rgba(25, 118, 210, 0.08);
}

.brick-dropzone__empty {
  padding: 16px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  color: #aaa;
  text-align: center;
  font-size: 13px;
}
</style>
