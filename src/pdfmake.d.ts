declare module 'pdfmake/build/pdfmake' {
  interface FontFamily {
    normal: string
    bold: string
    italics: string
    bolditalics: string
  }
  const pdfMake: {
    vfs: Record<string, string>
    fonts?: Record<string, FontFamily>
    createPdf(docDefinition: Record<string, unknown>): {
      download(filename?: string): void
      open(): void
      getBlob(cb: (blob: Blob) => void): void
    }
  }
  export default pdfMake
}

declare module 'pdfmake/build/vfs_fonts' {
  const pdfMake: { vfs: Record<string, string> } | undefined
  export { pdfMake }
  const _default: Record<string, string>
  export default _default
}
