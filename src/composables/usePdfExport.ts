import { toRaw, provide, inject, type InjectionKey } from 'vue'
import type { ElementNode } from '../types'
import type { DocumentStore } from './useDocumentStore'
import { getElementDefinition } from '../registry/elementRegistry'

export interface PdfExportApi {
  toDocumentDefinition(): Record<string, unknown>
  exportPdf(filename?: string): void
  openPdf(): void
}

const PDF_EXPORT_KEY: InjectionKey<PdfExportApi> = Symbol('brick-pdf-export')

function convertChildren(children: ElementNode[]): unknown[] {
  return children.map(convertNode)
}

function convertNode(node: ElementNode): unknown {
  const def = getElementDefinition(node.type)
  if (!def) {
    return { text: `[Unknown: ${node.type}]` }
  }
  return def.toPdfmake(node, convertChildren)
}

function applyStyle(obj: Record<string, unknown>, style: Record<string, unknown>): Record<string, unknown> {
  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined) {
      obj[key] = value
    }
  }
  return obj
}

export function createPdfExport(store: DocumentStore): PdfExportApi {
  function toDocumentDefinition(): Record<string, unknown> {
    const doc = store.document
    return {
      pageSize: doc.pageSize,
      pageOrientation: doc.pageOrientation,
      pageMargins: doc.pageMargins,
      defaultStyle: JSON.parse(JSON.stringify(toRaw(doc.defaultStyle))),
      styles: JSON.parse(JSON.stringify(toRaw(doc.styles))),
      content: doc.content.map(convertNode),
    }
  }

  async function getPdfMake() {
    const pdfMakeModule = await import('pdfmake/build/pdfmake')
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts')
    const pdfMake = pdfMakeModule.default || pdfMakeModule
    const fonts = pdfFontsModule.pdfMake
    if (fonts && fonts.vfs) {
      pdfMake.vfs = fonts.vfs
    } else if ((pdfFontsModule as Record<string, unknown>).default) {
      pdfMake.vfs = (pdfFontsModule as Record<string, unknown>).default as Record<string, string>
    }
    return pdfMake
  }

  function exportPdf(filename?: string): void {
    const docDef = toDocumentDefinition()
    getPdfMake().then((pdfMake) => {
      pdfMake.createPdf(docDef).download(filename ?? 'document.pdf')
    })
  }

  function openPdf(): void {
    const docDef = toDocumentDefinition()
    getPdfMake().then((pdfMake) => {
      pdfMake.createPdf(docDef).open()
    })
  }

  return { toDocumentDefinition, exportPdf, openPdf }
}

export function providePdfExport(api: PdfExportApi): void {
  provide(PDF_EXPORT_KEY, api)
}

export function usePdfExport(): PdfExportApi {
  const api = inject(PDF_EXPORT_KEY)
  if (!api) {
    throw new Error('usePdfExport() requires a BrickPdf ancestor component')
  }
  return api
}

export { applyStyle }
