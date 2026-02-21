<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div
    class="brick-el-qr"
    :style="{
      width: ((node.props.fit as number) ?? 100) + 'px',
      height: ((node.props.fit as number) ?? 100) + 'px',
    }"
  >
    <div class="brick-el-qr__preview">QR: {{ node.props.data }}</div>
  </div>
</template>

<style scoped>
.brick-el-qr {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background: #fafafa;
  font-size: 11px;
  color: #666;
  text-align: center;
  padding: 4px;
  word-break: break-all;
}
</style>
