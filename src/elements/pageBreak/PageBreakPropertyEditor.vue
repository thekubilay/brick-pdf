<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div class="brick-pagebreak-editor">
    <p style="color: #999; font-size: 12px;">No configurable properties.</p>
  </div>
</template>
