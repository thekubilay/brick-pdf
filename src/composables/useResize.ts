import { ref, provide, inject, type InjectionKey, type Ref } from 'vue'
import type { ElementActionsApi } from './useElementActions'

export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export interface ResizeApi {
  isResizing: Ref<boolean>
  startResize(elementId: string, handle: ResizeHandle, initialRect: DOMRect, event: PointerEvent): void
}

const RESIZE_KEY: InjectionKey<ResizeApi> = Symbol('brick-pdf-resize')

export function createResize(actions: ElementActionsApi): ResizeApi {
  const isResizing = ref(false)

  function startResize(
    elementId: string,
    handle: ResizeHandle,
    initialRect: DOMRect,
    event: PointerEvent,
  ): void {
    isResizing.value = true
    const startX = event.clientX
    const startY = event.clientY
    const startWidth = initialRect.width
    const startHeight = initialRect.height

    function onPointerMove(e: PointerEvent): void {
      const dx = e.clientX - startX
      const dy = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight

      if (handle.includes('e')) newWidth = startWidth + dx
      if (handle.includes('w')) newWidth = startWidth - dx
      if (handle.includes('s')) newHeight = startHeight + dy
      if (handle.includes('n')) newHeight = startHeight - dy

      newWidth = Math.max(20, newWidth)
      newHeight = Math.max(20, newHeight)

      actions.updateStyle(elementId, {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      })
    }

    function onPointerUp(): void {
      isResizing.value = false
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  return { isResizing, startResize }
}

export function provideResize(api: ResizeApi): void {
  provide(RESIZE_KEY, api)
}

export function useResize(): ResizeApi {
  const api = inject(RESIZE_KEY)
  if (!api) {
    throw new Error('useResize() requires a BrickPdf ancestor component')
  }
  return api
}
