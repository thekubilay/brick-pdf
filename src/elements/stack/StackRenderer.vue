<script setup lang="ts">
import type { ElementNode, ElementPath } from '../../types'

defineProps<{
  node: ElementNode
  path: ElementPath
}>()
</script>

<template>
  <div class="brick-el-stack" :style="{ backgroundColor: node.style.fillColor }">
    <slot />
  </div>
</template>

<style scoped>
.brick-el-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 40px;
  padding: 8px;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style>
