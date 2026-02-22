<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ElementNode, ElementPath } from '../types'
import { getElementDefinition } from '../registry/elementRegistry'
import { useSelection, useElementActions } from '../composables'
import DropZone from './DropZone.vue'

const props = defineProps<{
  node: ElementNode
  path: ElementPath
}>()

const selection = useSelection()
const actions = useElementActions()
const elRef = ref<HTMLElement | null>(null)

const definition = computed(() => getElementDefinition(props.node.type))
const isSelected = computed(() => selection.selectedId.value === props.node.id)

const hasWidth = computed(() => {
  if (!definition.value) return false
  return definition.value.propertyFields.some(f => f.key === 'props.width' || f.key === 'style.width')
})

const hasHeight = computed(() => {
  if (!definition.value) return false
  return definition.value.propertyFields.some(f => f.key === 'props.height' || f.key === 'style.height')
})

function onSelect(e: MouseEvent): void {
  e.stopPropagation()
  selection.select(props.node.id)
}

function startWidthResize(e: PointerEvent): void {
  e.stopPropagation()
  e.preventDefault()
  const startX = e.clientX
  const startWidth = elRef.value?.offsetWidth ?? 200

  function onMove(ev: PointerEvent): void {
    const dx = ev.clientX - startX
    const newWidth = Math.max(20, startWidth + dx)
    // Update props.width if element uses it, otherwise style.width
    const usesPropWidth = definition.value?.propertyFields.some(f => f.key === 'props.width')
    if (usesPropWidth) {
      actions.updateProps(props.node.id, { width: Math.round(newWidth) })
    } else {
      actions.updateStyle(props.node.id, { width: Math.round(newWidth) })
    }
  }

  function onUp(): void {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function startHeightResize(e: PointerEvent): void {
  e.stopPropagation()
  e.preventDefault()
  const startY = e.clientY
  const startHeight = elRef.value?.offsetHeight ?? 100

  function onMove(ev: PointerEvent): void {
    const dy = ev.clientY - startY
    const newHeight = Math.max(20, startHeight + dy)
    const usesPropHeight = definition.value?.propertyFields.some(f => f.key === 'props.height')
    if (usesPropHeight) {
      actions.updateProps(props.node.id, { height: Math.round(newHeight) })
    } else {
      actions.updateStyle(props.node.id, { height: Math.round(newHeight) })
    }
  }

  function onUp(): void {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'ns-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function startCornerResize(e: PointerEvent): void {
  e.stopPropagation()
  e.preventDefault()
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = elRef.value?.offsetWidth ?? 200
  const startHeight = elRef.value?.offsetHeight ?? 100

  function onMove(ev: PointerEvent): void {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    const newWidth = Math.max(20, startWidth + dx)
    const newHeight = Math.max(20, startHeight + dy)

    const usesPropWidth = definition.value?.propertyFields.some(f => f.key === 'props.width')
    const usesPropHeight = definition.value?.propertyFields.some(f => f.key === 'props.height')

    if (usesPropWidth) {
      actions.updateProps(props.node.id, { width: Math.round(newWidth) })
    } else {
      actions.updateStyle(props.node.id, { width: Math.round(newWidth) })
    }
    if (usesPropHeight) {
      actions.updateProps(props.node.id, { height: Math.round(newHeight) })
    } else {
      actions.updateStyle(props.node.id, { height: Math.round(newHeight) })
    }
  }

  function onUp(): void {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'nwse-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}
</script>

<template>
  <div
    ref="elRef"
    class="brick-canvas-element"
    :class="{ 'brick-canvas-element--selected': isSelected }"
    :data-element-id="node.id"
    :data-element-type="node.type"
    :style="{
      width: typeof node.style.width === 'number' ? node.style.width + 'px' :
             node.props.width ? (node.props.width as number) + 'px' : node.style.width,
      height: node.style.height ? node.style.height + 'px' :
              node.props.height ? (node.props.height as number) + 'px' : undefined,
      marginTop: node.style.margin?.[1] + 'px',
      marginRight: node.style.margin?.[2] + 'px',
      marginBottom: node.style.margin?.[3] + 'px',
      marginLeft: node.style.margin?.[0] + 'px',
      textAlign: node.style.alignment,
    }"
    @click="onSelect"
  >
    <component
      v-if="definition"
      :is="definition.rendererComponent"
      :node="node"
      :path="path"
    >
      <template v-if="definition.isContainer">
        <DropZone :parent-id="node.id" :layout="node.type === 'columns' ? 'horizontal' : 'vertical'">
          <CanvasElement
            v-for="(child, index) in node.children"
            :key="child.id"
            :node="child"
            :path="[...path, index]"
          />
        </DropZone>
      </template>
    </component>
    <div v-else class="brick-canvas-element__unknown">
      Unknown element: {{ node.type }}
    </div>

    <!-- Resize handles — only shown when selected -->
    <template v-if="isSelected">
      <div
        v-if="hasWidth"
        class="brick-resize-handle brick-resize-handle--e"
        @pointerdown="startWidthResize"
      />
      <div
        v-if="hasHeight"
        class="brick-resize-handle brick-resize-handle--s"
        @pointerdown="startHeightResize"
      />
      <div
        v-if="hasWidth && hasHeight"
        class="brick-resize-handle brick-resize-handle--se"
        @pointerdown="startCornerResize"
      />
    </template>
  </div>
</template>

<style scoped>
.brick-canvas-element {
  position: relative;
  cursor: pointer;
  transition: outline 0.15s;
}

.brick-canvas-element:hover {
  outline: 1px dashed #90caf9;
}

.brick-canvas-element--selected {
  outline: 2px solid #1976d2 !important;
}

.brick-canvas-element__unknown {
  padding: 8px;
  background: #fff3e0;
  border: 1px dashed #ff9800;
  color: #e65100;
  font-size: 12px;
}

/* Resize handles */
.brick-resize-handle {
  position: absolute;
  z-index: 10;
  background: #1976d2;
}

.brick-resize-handle--e {
  top: 0;
  right: -3px;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  opacity: 0;
  transition: opacity 0.15s;
}

.brick-resize-handle--s {
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 6px;
  cursor: ns-resize;
  opacity: 0;
  transition: opacity 0.15s;
}

.brick-resize-handle--se {
  bottom: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  cursor: nwse-resize;
  border-radius: 2px;
  opacity: 0.8;
}

.brick-canvas-element--selected .brick-resize-handle--e,
.brick-canvas-element--selected .brick-resize-handle--s {
  opacity: 0.3;
}

.brick-resize-handle--e:hover,
.brick-resize-handle--s:hover,
.brick-resize-handle--se:hover {
  opacity: 1 !important;
}
</style>
