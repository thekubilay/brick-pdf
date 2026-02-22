<script setup lang="ts">
import { computed } from 'vue'
import { useDocumentStore, useSelection } from '../composables'
import type { PageSize } from '../types'
import CanvasElement from './CanvasElement.vue'
import DropZone from './DropZone.vue'
import DocumentSettings from './DocumentSettings.vue'

const store = useDocumentStore()
const selection = useSelection()

// pdfmake point sizes for each page format
const pageDimensions: Record<PageSize, [number, number]> = {
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  LETTER: [612, 792],
  LEGAL: [612, 1008],
}

const SCALE = 0.75 // scale down so pages fit nicely on screen

const pageWidth = computed(() => {
  const [w, h] = pageDimensions[store.document.pageSize] ?? pageDimensions.A4
  const width = store.document.pageOrientation === 'landscape' ? h : w
  return Math.round(width * SCALE)
})

const pageHeight = computed(() => {
  const [w, h] = pageDimensions[store.document.pageSize] ?? pageDimensions.A4
  const height = store.document.pageOrientation === 'landscape' ? w : h
  return Math.round(height * SCALE)
})

function onCanvasClick(e: MouseEvent): void {
  if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('brick-canvas__page')) {
    selection.deselect()
  }
}
</script>

<template>
  <div class="brick-canvas">
    <DocumentSettings />
    <div class="brick-canvas__scroll" @click="onCanvasClick">
      <div
        class="brick-canvas__page"
        :style="{
          width: pageWidth + 'px',
          minHeight: pageHeight + 'px',
          '--page-height': pageHeight + 'px',
          '--margin-top': store.document.pageMargins[1] * SCALE + 'px',
          '--margin-bottom': store.document.pageMargins[3] * SCALE + 'px',
          paddingTop: store.document.pageMargins[1] * SCALE + 'px',
          paddingRight: store.document.pageMargins[2] * SCALE + 'px',
          paddingBottom: store.document.pageMargins[3] * SCALE + 'px',
          paddingLeft: store.document.pageMargins[0] * SCALE + 'px',
        } as any"
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
  </div>
</template>

<style scoped>
.brick-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.brick-canvas__scroll {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}

.brick-canvas__page {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.2s, min-height 0.2s;
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: white;

  --gap: 28px;
  --slice: calc(var(--page-height) + var(--gap));
  --content-start: var(--margin-top);
  --content-end: calc(var(--page-height) - var(--margin-bottom));
}

/* Dashed margin guide lines */
.brick-canvas__page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  opacity: 0.2;
  background:
    /* horizontal dash pattern */
    repeating-linear-gradient(
      to right,
      black 0px, black 5px,
      white 5px, white 10px
    ),
    /* 1px lines at margin-top and margin-bottom positions */
    repeating-linear-gradient(
      to bottom,
      white 0px,
      white calc(var(--content-start) - 1px),
      black calc(var(--content-start) - 1px),
      black var(--content-start),
      white var(--content-start),
      white var(--content-end),
      black var(--content-end),
      black calc(var(--content-end) + 1px),
      white calc(var(--content-end) + 1px),
      white var(--slice)
    );
  background-blend-mode: screen;
}

/* Opaque gap overlay between pages — hides content flowing through */
.brick-canvas__page::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background:
    /* page shadow bottom edge */
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent calc(var(--page-height) - 1px),
      rgba(0,0,0,0.08) calc(var(--page-height) - 1px),
      rgba(0,0,0,0.03) calc(var(--page-height) + 4px),
      transparent calc(var(--page-height) + 4px),
      transparent var(--slice)
    ),
    /* page shadow top edge */
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent calc(var(--page-height) + var(--gap) - 4px),
      rgba(0,0,0,0.03) calc(var(--page-height) + var(--gap) - 4px),
      rgba(0,0,0,0.08) calc(var(--page-height) + var(--gap) - 1px),
      transparent calc(var(--page-height) + var(--gap) - 1px),
      transparent var(--slice)
    ),
    /* opaque gray gap */
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent var(--page-height),
      #e8e8e8 var(--page-height),
      #e8e8e8 var(--slice)
    );
}

.brick-canvas__page > :deep(.brick-dropzone) {
  flex: 1;
}
</style>
