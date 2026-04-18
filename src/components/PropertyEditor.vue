<script setup lang="ts">
import { computed } from 'vue'
import { useSelection, useElementActions } from '../composables'
import { getElementDefinition } from '../registry/elementRegistry'
import type { PropertyFieldDescriptor } from '../types'
import PropertyField from './PropertyField.vue'

const selection = useSelection()
const actions = useElementActions()

function onKeyInput(e: Event): void {
  const node = selection.selectedNode.value
  if (!node) return
  actions.updateKey(node.id, (e.target as HTMLInputElement).value)
}

const definition = computed(() => {
  const node = selection.selectedNode.value
  if (!node) return null
  return getElementDefinition(node.type)
})

const groupedFields = computed(() => {
  if (!definition.value) return {}
  const groups: Record<string, PropertyFieldDescriptor[]> = {}
  for (const field of definition.value!.propertyFields) {
    if (!groups[field.section]) groups[field.section] = []
    groups[field.section]!.push(field)
  }
  return groups
})

const sectionLabels: Record<string, string> = {
  content: 'Content',
  style: 'Style',
  layout: 'Layout',
  advanced: 'Advanced',
}

const sectionOrder = ['content', 'style', 'layout', 'advanced']
</script>

<template>
  <div v-if="selection.selectedNode.value && definition" class="brick-property-editor">
    <div class="brick-property-editor__type">
      {{ definition.icon }} {{ definition.label }}
    </div>

    <div class="brick-property-editor__key">
      <label class="brick-property-editor__key-label">Key</label>
      <input
        type="text"
        class="brick-property-editor__key-input"
        :value="selection.selectedNode.value.key ?? ''"
        placeholder="(optional identifier)"
        @input="onKeyInput"
      />
    </div>

    <template v-for="section in sectionOrder" :key="section">
      <div v-if="groupedFields[section]" class="brick-property-editor__group">
        <div class="brick-property-editor__group-title">{{ sectionLabels[section] }}</div>
        <PropertyField
          v-for="field in groupedFields[section]"
          :key="field.key"
          :descriptor="field"
          :node="selection.selectedNode.value"
        />
      </div>
    </template>

    <component
      :is="definition.propertyEditorComponent"
      :node="selection.selectedNode.value"
    />
  </div>
</template>

<style scoped>
.brick-property-editor__type {
  font-weight: 600;
  font-size: 13px;
  padding: 4px 0 8px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.brick-property-editor__group {
  margin-bottom: 12px;
}

.brick-property-editor__group-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
  margin-bottom: 6px;
}

.brick-property-editor__key {
  margin-bottom: 12px;
}

.brick-property-editor__key-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  margin-bottom: 5px;
}

.brick-property-editor__key-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.brick-property-editor__key-input:focus {
  outline: none;
  border-color: #1976d2;
}
</style>
