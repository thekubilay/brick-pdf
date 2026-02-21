<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div class="brick-el-list" :style="{ fontSize: (node.style.fontSize ?? 12) + 'px', color: node.style.color }">
    <component :is="(node.props.ordered as boolean) ? 'ol' : 'ul'">
      <li v-for="(item, i) in (node.props.items as string[])" :key="i">{{ item }}</li>
    </component>
  </div>
</template>

<style scoped>
.brick-el-list {
  padding-left: 20px;
}
</style>
