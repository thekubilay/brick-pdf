<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div class="brick-el-pagebreak">
    <hr />
    <span>Page Break</span>
    <hr />
  </div>
</template>

<style scoped>
.brick-el-pagebreak {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #999;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.brick-el-pagebreak hr {
  flex: 1;
  border: none;
  border-top: 2px dashed #ccc;
}
</style>
