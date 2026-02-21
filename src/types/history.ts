import type { ElementNode } from './element'

export interface HistorySnapshot {
  content: ElementNode[]
  timestamp: number
}
