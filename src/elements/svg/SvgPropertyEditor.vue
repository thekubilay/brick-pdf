<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div class="brick-svg-editor"></div>
</template>
