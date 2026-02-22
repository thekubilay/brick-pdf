<script setup lang="ts">
import { useSelection } from '../composables'
import ToolbarElementList from './ToolbarElementList.vue'
import PropertyEditor from './PropertyEditor.vue'

const selection = useSelection()
</script>

<template>
  <div class="brick-toolbar">
    <div class="brick-toolbar__section">
      <h3 class="brick-toolbar__title">Elements</h3>
      <ToolbarElementList />
    </div>

    <div v-if="selection.selectedNode.value" class="brick-toolbar__section">
      <h3 class="brick-toolbar__title">Properties</h3>
      <PropertyEditor />
    </div>
  </div>
</template>

<style scoped>
.brick-toolbar {
  width: 280px;
  background: white;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
  flex-shrink: 0;
}

.brick-toolbar__section {
  border-bottom: 1px solid #eee;
  padding: 12px;
}

.brick-toolbar__title {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
}
</style>
