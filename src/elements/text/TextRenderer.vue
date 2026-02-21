<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div
    class="brick-el-text"
    :style="{
      fontSize: (node.style.fontSize ?? 12) + 'px',
      fontWeight: node.style.bold ? 'bold' : 'normal',
      fontStyle: node.style.italics ? 'italic' : 'normal',
      color: node.style.color,
      textAlign: node.style.alignment,
      lineHeight: node.style.lineHeight,
      textDecoration: node.style.decoration === 'lineThrough' ? 'line-through' : node.style.decoration,
      backgroundColor: node.style.background,
      opacity: node.style.opacity,
    }"
  >
    {{ node.props.text }}
  </div>
</template>

<style scoped>
.brick-el-text {
  min-height: 1em;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
