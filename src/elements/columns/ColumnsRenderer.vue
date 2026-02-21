<script setup lang="ts">
import type { ElementNode, ElementPath } from '../../types'

defineProps<{
  node: ElementNode
  path: ElementPath
}>()
</script>

<template>
  <div class="brick-el-columns" :style="{ gap: (node.props.columnGap as number ?? 10) + 'px' }">
    <slot />
  </div>
</template>

<style scoped>
.brick-el-columns {
  display: flex;
  flex-direction: row;
  min-height: 40px;
  padding: 8px;
  border: 1px dashed #aad;
  border-radius: 4px;
}

.brick-el-columns > :deep(*) {
  flex: 1;
  min-width: 0;
}
</style>
