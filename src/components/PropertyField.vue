<script setup lang="ts">
import { computed } from 'vue'
import type { ElementNode, PropertyFieldDescriptor } from '../types'
import { useElementActions } from '../composables'

const props = defineProps<{
  descriptor: PropertyFieldDescriptor
  node: ElementNode
}>()

const actions = useElementActions()

const value = computed(() => {
  const parts = props.descriptor.key.split('.')
  const section = parts[0] as string
  const key = parts[1] as string
  if (section === 'props') {
    return props.node.props[key]
  } else if (section === 'style') {
    return (props.node.style as Record<string, unknown>)[key]
  }
  return undefined
})

function onUpdate(newValue: unknown): void {
  const parts = props.descriptor.key.split('.')
  const section = parts[0] as string
  const key = parts[1] as string
  if (section === 'props') {
    actions.updateProps(props.node.id, { [key]: newValue })
  } else if (section === 'style') {
    actions.updateStyle(props.node.id, { [key]: newValue })
  }
}

function onMarginUpdate(index: number, val: number): void {
  const current = (value.value as [number, number, number, number]) ?? [0, 0, 0, 0]
  const updated: [number, number, number, number] = [...current]
  updated[index] = val
  onUpdate(updated)
}

function onFileChange(e: Event): void {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    onUpdate(reader.result as string)
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="brick-field">
    <label class="brick-field__label">{{ descriptor.label }}</label>

    <input
      v-if="descriptor.type === 'text'"
      type="text"
      class="brick-field__input"
      :value="value as string"
      @input="onUpdate(($event.target as HTMLInputElement).value)"
    />

    <textarea
      v-else-if="descriptor.type === 'textarea'"
      class="brick-field__textarea"
      :value="value as string"
      rows="3"
      @input="onUpdate(($event.target as HTMLTextAreaElement).value)"
    />

    <input
      v-else-if="descriptor.type === 'number'"
      type="number"
      class="brick-field__input"
      :value="value as number"
      :min="descriptor.min"
      :max="descriptor.max"
      :step="descriptor.step"
      @input="onUpdate(Number(($event.target as HTMLInputElement).value))"
    />

    <input
      v-else-if="descriptor.type === 'color'"
      type="color"
      class="brick-field__color"
      :value="(value as string) ?? '#000000'"
      @input="onUpdate(($event.target as HTMLInputElement).value)"
    />

    <select
      v-else-if="descriptor.type === 'select'"
      class="brick-field__select"
      :value="value"
      @change="onUpdate(($event.target as HTMLSelectElement).value || undefined)"
    >
      <option v-for="opt in descriptor.options" :key="String(opt.value)" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <label v-else-if="descriptor.type === 'toggle'" class="brick-field__toggle">
      <input
        type="checkbox"
        :checked="value as boolean"
        @change="onUpdate(($event.target as HTMLInputElement).checked)"
      />
      <span>{{ value ? 'On' : 'Off' }}</span>
    </label>

    <div v-else-if="descriptor.type === 'margin'" class="brick-field__margin">
      <input
        v-for="(label, i) in ['L', 'T', 'R', 'B']"
        :key="label"
        type="number"
        class="brick-field__margin-input"
        :placeholder="label"
        :value="((value as number[]) ?? [0,0,0,0])[i]"
        @input="onMarginUpdate(i, Number(($event.target as HTMLInputElement).value))"
      />
    </div>

    <div v-else-if="descriptor.type === 'slider'" class="brick-field__slider">
      <input
        type="range"
        :value="value as number"
        :min="descriptor.min"
        :max="descriptor.max"
        :step="descriptor.step"
        @input="onUpdate(Number(($event.target as HTMLInputElement).value))"
      />
      <span class="brick-field__slider-value">{{ value }}</span>
    </div>

    <input
      v-else-if="descriptor.type === 'file'"
      type="file"
      accept="image/*"
      class="brick-field__file"
      @change="onFileChange"
    />
  </div>
</template>

<style scoped>
.brick-field {
  margin-bottom: 8px;
}

.brick-field__label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 3px;
}

.brick-field__input,
.brick-field__textarea,
.brick-field__select {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  box-sizing: border-box;
}

.brick-field__input:focus,
.brick-field__textarea:focus,
.brick-field__select:focus {
  outline: none;
  border-color: #1976d2;
}

.brick-field__textarea {
  resize: vertical;
  font-family: inherit;
}

.brick-field__color {
  width: 100%;
  height: 28px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
}

.brick-field__toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
}

.brick-field__margin {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 4px;
}

.brick-field__margin-input {
  width: 100%;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 11px;
  text-align: center;
  box-sizing: border-box;
}

.brick-field__slider {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brick-field__slider input[type="range"] {
  flex: 1;
}

.brick-field__slider-value {
  font-size: 11px;
  min-width: 30px;
  text-align: right;
}

.brick-field__file {
  font-size: 11px;
}
</style>
