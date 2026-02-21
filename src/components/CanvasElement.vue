<script setup lang="ts">
import { computed } from 'vue'
import type { ElementNode, ElementPath } from '../types'
import { getElementDefinition } from '../registry/elementRegistry'
import { useSelection } from '../composables'
import DropZone from './DropZone.vue'

const props = defineProps<{
  node: ElementNode
  path: ElementPath
}>()

const selection = useSelection()

const definition = computed(() => getElementDefinition(props.node.type))
const isSelected = computed(() => selection.selectedId.value === props.node.id)

function onSelect(e: MouseEvent): void {
  e.stopPropagation()
  selection.select(props.node.id)
}
</script>

<template>
  <div
    class="brick-canvas-element"
    :class="{ 'brick-canvas-element--selected': isSelected }"
    :data-element-id="node.id"
    :data-element-type="node.type"
    :style="{
      width: typeof node.style.width === 'number' ? node.style.width + 'px' : node.style.width,
      height: node.style.height ? node.style.height + 'px' : undefined,
      marginTop: node.style.margin?.[1] + 'px',
      marginRight: node.style.margin?.[2] + 'px',
      marginBottom: node.style.margin?.[3] + 'px',
      marginLeft: node.style.margin?.[0] + 'px',
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
        <DropZone :parent-id="node.id">
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
</style>
