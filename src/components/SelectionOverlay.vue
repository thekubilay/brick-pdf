<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSelection, useResize } from '../composables'
import type { ResizeHandle } from '../composables/useResize'

const selection = useSelection()
const resize = useResize()

const rect = ref<DOMRect | null>(null)

const handles: ResizeHandle[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

watch(
  () => selection.selectedId.value,
  () => {
    updateRect()
  },
)

function updateRect(): void {
  if (!selection.selectedId.value) {
    rect.value = null
    return
  }
  const el = document.querySelector(`[data-element-id="${selection.selectedId.value}"]`)
  if (el) {
    rect.value = el.getBoundingClientRect()
  }
}

function onHandlePointerDown(handle: ResizeHandle, e: PointerEvent): void {
  if (!rect.value || !selection.selectedId.value) return
  e.stopPropagation()
  resize.startResize(selection.selectedId.value, handle, rect.value, e)
}

const handlePositions: Record<ResizeHandle, Record<string, string>> = {
  n: { top: '-4px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  s: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  e: { top: '50%', right: '-4px', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  w: { top: '50%', left: '-4px', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  ne: { top: '-4px', right: '-4px', cursor: 'nesw-resize' },
  nw: { top: '-4px', left: '-4px', cursor: 'nwse-resize' },
  se: { bottom: '-4px', right: '-4px', cursor: 'nwse-resize' },
  sw: { bottom: '-4px', left: '-4px', cursor: 'nesw-resize' },
}
</script>

<template>
  <div v-if="rect" class="brick-selection-overlay" :style="{
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
  }">
    <div
      v-for="handle in handles"
      :key="handle"
      class="brick-selection-overlay__handle"
      :style="handlePositions[handle]"
      @pointerdown="onHandlePointerDown(handle, $event)"
    />
  </div>
</template>

<style scoped>
.brick-selection-overlay {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
}

.brick-selection-overlay__handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #1976d2;
  border: 1px solid white;
  border-radius: 50%;
  pointer-events: all;
}
</style>
