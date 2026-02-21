declare module 'pdfmake/build/pdfmake' {
  const pdfMake: {
    vfs: Record<string, string>
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
