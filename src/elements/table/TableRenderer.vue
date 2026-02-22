<script setup lang="ts">
import type { ElementNode } from '../../types'

defineProps<{
  node: ElementNode
}>()
</script>

<template>
  <div
    class="brick-el-table"
    :class="'brick-el-table--' + (node.props.layout as string ?? 'lightHorizontalLines')"
    :style="{ fontSize: (node.style.fontSize ?? 12) + 'px', color: node.style.color }"
  >
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
}
.brick-el-table th,
.brick-el-table td {
  padding: 4px 8px;
  text-align: left;
}
.brick-el-table th {
  font-weight: bold;
}

/* Layout: noBorders */
.brick-el-table--noBorders th,
.brick-el-table--noBorders td {
  border: none;
}

/* Layout: headerLineOnly */
.brick-el-table--headerLineOnly th,
.brick-el-table--headerLineOnly td {
  border: none;
}
.brick-el-table--headerLineOnly thead tr:last-child th {
  border-bottom: 2px solid #333;
}

/* Layout: lightHorizontalLines */
.brick-el-table--lightHorizontalLines th,
.brick-el-table--lightHorizontalLines td {
  border: none;
  border-bottom: 1px solid #ccc;
}
.brick-el-table--lightHorizontalLines thead tr:last-child th {
  border-bottom: 2px solid #333;
}

/* Layout: grid (all borders) */
.brick-el-table--grid th,
.brick-el-table--grid td {
  border: 1px solid #333;
}

/* Layout: none (same as noBorders for preview) */
.brick-el-table--none th,
.brick-el-table--none td {
  border: none;
}

/* Header background hint */
.brick-el-table th {
  background: rgba(0, 0, 0, 0.04);
}
</style>
