<script setup lang="ts">
import type { ElementNode } from '../../types'
import { useElementActions } from '../../composables'

const props = defineProps<{
  node: ElementNode
}>()

const actions = useElementActions()

function getBody(): string[][] {
  return (props.node.props.body as string[][]) ?? []
}

function getWidths(): string[] {
  return (props.node.props.widths as string[]) ?? []
}

function updateCell(ri: number, ci: number, value: string): void {
  const body = getBody().map(row => [...row])
  body[ri]![ci] = value
  actions.updateProps(props.node.id, { body })
}

function addRow(): void {
  const body = getBody().map(row => [...row])
  const cols = body[0]?.length ?? 2
  body.push(Array(cols).fill(''))
  actions.updateProps(props.node.id, { body })
}

function removeRow(ri: number): void {
  const body = getBody().map(row => [...row])
  if (body.length <= 1) return
  body.splice(ri, 1)
  // Adjust headerRows if needed
  const headerRows = props.node.props.headerRows as number
  if (headerRows > body.length) {
    actions.updateProps(props.node.id, { body, headerRows: body.length })
  } else {
    actions.updateProps(props.node.id, { body })
  }
}

function addColumn(): void {
  const body = getBody().map(row => [...row, ''])
  const widths = [...getWidths(), '*']
  actions.updateProps(props.node.id, { body, widths })
}

function removeColumn(ci: number): void {
  const body = getBody().map(row => {
    const newRow = [...row]
    newRow.splice(ci, 1)
    return newRow
  })
  if ((body[0]?.length ?? 0) < 1) return
  const widths = [...getWidths()]
  widths.splice(ci, 1)
  actions.updateProps(props.node.id, { body, widths })
}
</script>

<template>
  <div class="brick-table-editor">
    <div class="brick-table-editor__actions">
      <button class="brick-table-editor__btn" @click="addRow">+ Row</button>
      <button class="brick-table-editor__btn" @click="addColumn">+ Column</button>
    </div>

    <div class="brick-table-editor__grid">
      <table>
        <thead>
          <tr>
            <th class="brick-table-editor__corner"></th>
            <th
              v-for="(_, ci) in (getBody()[0] ?? [])"
              :key="ci"
              class="brick-table-editor__col-header"
            >
              Col {{ ci + 1 }}
              <button
                v-if="(getBody()[0]?.length ?? 0) > 1"
                class="brick-table-editor__remove-btn"
                title="Remove column"
                @click="removeColumn(ci)"
              >x</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in getBody()" :key="ri">
            <td class="brick-table-editor__row-header">
              {{ ri + 1 }}
              <button
                v-if="getBody().length > 1"
                class="brick-table-editor__remove-btn"
                title="Remove row"
                @click="removeRow(ri)"
              >x</button>
            </td>
            <td v-for="(cell, ci) in row" :key="ci">
              <input
                class="brick-table-editor__cell"
                type="text"
                :value="cell"
                @input="updateCell(ri, ci, ($event.target as HTMLInputElement).value)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.brick-table-editor__actions {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.brick-table-editor__btn {
  padding: 3px 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #f5f5f5;
  font-size: 11px;
  cursor: pointer;
}

.brick-table-editor__btn:hover {
  background: #e3f2fd;
  border-color: #90caf9;
}

.brick-table-editor__grid {
  overflow-x: auto;
}

.brick-table-editor__grid table {
  border-collapse: collapse;
  width: 100%;
}

.brick-table-editor__corner {
  width: 32px;
}

.brick-table-editor__col-header,
.brick-table-editor__row-header {
  font-size: 10px;
  color: #999;
  font-weight: 500;
  padding: 2px 4px;
  white-space: nowrap;
  position: relative;
}

.brick-table-editor__col-header {
  text-align: center;
}

.brick-table-editor__row-header {
  text-align: right;
  width: 32px;
}

.brick-table-editor__remove-btn {
  display: inline-block;
  margin-left: 2px;
  padding: 0 3px;
  border: none;
  background: none;
  color: #d32f2f;
  font-size: 10px;
  cursor: pointer;
  opacity: 0.5;
  vertical-align: middle;
}

.brick-table-editor__remove-btn:hover {
  opacity: 1;
}

.brick-table-editor__cell {
  width: 100%;
  padding: 3px 4px;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  font-size: 11px;
  box-sizing: border-box;
}

.brick-table-editor__cell:focus {
  outline: none;
  border-color: #1976d2;
}
</style>
