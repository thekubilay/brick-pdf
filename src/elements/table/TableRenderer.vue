<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div class="brick-el-table">
    <table>
      <thead>
        <tr v-for="(row, ri) in (node.props.body as string[][]).slice(0, node.props.headerRows as number)" :key="'h' + ri">
          <th v-for="(cell, ci) in row" :key="ci">{{ cell }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in (node.props.body as string[][]).slice(node.props.headerRows as number)" :key="'b' + ri">
          <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.brick-el-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.brick-el-table th,
.brick-el-table td {
  border: 1px solid #ccc;
  padding: 4px 8px;
  text-align: left;
}
.brick-el-table th {
  background: #f0f0f0;
  font-weight: bold;
}
</style>
