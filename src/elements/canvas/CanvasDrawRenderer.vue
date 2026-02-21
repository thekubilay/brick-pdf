<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div
    class="brick-el-canvas"
    :style="{
      width: (node.props.width as number ?? 200) + 'px',
      height: (node.props.height as number ?? 100) + 'px',
    }"
  >
    <div class="brick-el-canvas__label">Canvas Drawing</div>
  </div>
</template>

<style scoped>
.brick-el-canvas {
  background: #f8f8f8;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}
</style>
