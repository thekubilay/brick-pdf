<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div
    class="brick-el-svg"
    :style="{
      width: (node.props.width as number) + 'px',
      height: (node.props.height as number) + 'px',
    }"
    v-html="node.props.svg as string"
  />
</template>

<style scoped>
.brick-el-svg {
  display: inline-block;
  overflow: hidden;
}
.brick-el-svg :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
