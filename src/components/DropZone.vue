<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useDragDrop } from '../composables'
import Sortable from 'sortablejs'

const props = defineProps<{
  parentId: string | null
}>()

const el = ref<HTMLElement | null>(null)
let sortable: Sortable | null = null
const dragDrop = useDragDrop()

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
  <div ref="el" class="brick-dropzone">
    <slot />
    <div v-if="!$slots.default" class="brick-dropzone__empty">
      Drop elements here
    </div>
  </div>
</template>

<style scoped>
.brick-dropzone {
  min-height: 40px;
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
