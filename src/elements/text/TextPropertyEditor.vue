<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div class="brick-text-editor">
    <!-- Custom text-specific UI if needed beyond PropertyField -->
  </div>
</template>
