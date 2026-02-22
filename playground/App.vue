<script setup lang="ts">
import { ref } from 'vue'
import { BrickPdf } from '../src/index'
import type { DocumentDefinition } from '../src/types'

const doc = ref<DocumentDefinition>(undefined)

function onUpdate(value: DocumentDefinition) {
  doc.value = value
  console.log('Document updated:', JSON.stringify(value, null, 2))
}
</script>

<template>
  <div class="playground">
    <BrickPdf :model-value="doc" @update:model-value="onUpdate" />
  </div>
</template>

<style>
.playground {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
