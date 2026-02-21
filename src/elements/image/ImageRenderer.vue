<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div class="brick-el-image">
    <img
      v-if="node.props.src"
      :src="node.props.src as string"
      :style="{
        width: (node.props.width as number) + 'px',
        height: (node.props.height as number) + 'px',
        objectFit: 'contain',
        opacity: node.style.opacity,
      }"
    />
    <div v-else class="brick-el-image__placeholder">
      No image selected
    </div>
  </div>
</template>

<style scoped>
.brick-el-image {
  display: inline-block;
}
.brick-el-image img {
  max-width: 100%;
  display: block;
}
.brick-el-image__placeholder {
  width: 200px;
  height: 150px;
  background: #f0f0f0;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
</style>
