<script setup lang="ts">
import { useDocumentStore, useSelection } from '../composables'
import CanvasElement from './CanvasElement.vue'
import DropZone from './DropZone.vue'

const store = useDocumentStore()
const selection = useSelection()

function onCanvasClick(e: MouseEvent): void {
  if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('brick-canvas__page')) {
    selection.deselect()
  }
}
</script>

<template>
  <div class="brick-canvas" @click="onCanvasClick">
    <div
      class="brick-canvas__page"
      :style="{
        paddingTop: store.document.pageMargins[1] + 'px',
        paddingRight: store.document.pageMargins[2] + 'px',
        paddingBottom: store.document.pageMargins[3] + 'px',
        paddingLeft: store.document.pageMargins[0] + 'px',
      }"
    >
      <DropZone :parent-id="null">
        <CanvasElement
          v-for="(node, index) in store.document.content"
          :key="node.id"
          :node="node"
          :path="[index]"
        />
      </DropZone>
    </div>
  </div>
</template>

<style scoped>
.brick-canvas {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
}

.brick-canvas__page {
  width: 595px;
  min-height: 842px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  flex-shrink: 0;
}
</style>
