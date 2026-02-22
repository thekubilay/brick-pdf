<script setup lang="ts">
import type { ElementNode, ElementPath } from '../../types'

defineProps<{
  node: ElementNode
  path: ElementPath
}>()
</script>

<template>
  <div class="brick-el-columns" :style="{ '--column-gap': (node.props.columnGap as number ?? 10) + 'px' }">
    <slot />
  </div>
</template>

<style scoped>
.brick-el-columns {
  min-height: 40px;
  padding: 8px;
  border: 1px dashed #aad;
  border-radius: 4px;
}

.brick-el-columns > :deep(.brick-dropzone--horizontal) {
  gap: var(--column-gap, 10px);
}
</style>
