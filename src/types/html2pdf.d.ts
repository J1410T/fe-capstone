declare module "html2pdf.js" {
  const html2pdf: {
    (element: HTMLElement, options?: Record<string, unknown>): void;
    // Add other function signatures or properties if needed
  };
  export default html2pdf;
}
