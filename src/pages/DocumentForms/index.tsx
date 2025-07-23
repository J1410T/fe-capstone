import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import html2pdf from "html2pdf.js";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import styleText from "@/assets/style.css?inline"; // your CSS imported inline

type EditorInstance = { getContent: () => string } | null;

const DOCUMENT_FORMS = [
  "BM1.html",
  "BM2.html",
  "BM3.html",
  "BM4.html",
  "BM5.html",
  "BM6.html",
  "BM10.html",
  "BM11.html",
];

export default function DocumentForms() {
  const editorRef = useRef<EditorInstance>(null);
  const [selectedForm, setSelectedForm] = useState<string>(DOCUMENT_FORMS[0]);
  const [formContent, setFormContent] = useState<string>("");
  const [formStyles, setFormStyles] = useState<string>("");
  const [pdfPreviewHtml, setPdfPreviewHtml] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  // Load the form HTML & extract styles when selectedForm changes
  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await fetch(`/src/components/form/${selectedForm}`);
        const htmlText = await response.text();

        // Extract <style> content
        const styleMatch = htmlText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        setFormStyles(styleMatch ? styleMatch[1] : "");

        // Extract <body> content or fallback to full content without styles
        const bodyMatch = htmlText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const content = bodyMatch
          ? bodyMatch[1]
          : htmlText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

        setFormContent(content);
      } catch (error) {
        console.error("Failed to load form:", error);
        setFormContent("");
        setFormStyles("");
      }
    }
    fetchForm();
  }, [selectedForm]);

  // Preview PDF - create HTML string with styles and content
  const previewPdf = () => {
    const content = editorRef.current?.getContent() ?? "";
    const html = `
      <style>${styleText}</style>
      <style>${formStyles}</style>
      <div style="background:#fff; color:#252525; padding:24px; width:210mm; min-height:297mm; box-sizing:border-box; margin:0 auto;">
        ${content}
      </div>
    `.replace(/oklch\([^)]+\)/g, "#000"); // Fix unsupported CSS colors

    setPdfPreviewHtml(html);
    setIsPreviewOpen(true);
  };

  // Download PDF with html2pdf.js
  const downloadPdf = async () => {
    const content = editorRef.current?.getContent() ?? "";
    const html = `
      <style>${styleText}</style>
      <style>${formStyles}</style>
      <div style="background:#fff; color:#252525; padding:24px; width:210mm; min-height:297mm; box-sizing:border-box; margin:0 auto;">
        ${content}
      </div>
    `.replace(/oklch\([^)]+\)/g, "#000");

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    html2pdf(tempDiv, {
      margin: 0.5,
      filename: "document-form.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    });

    setIsPreviewOpen(false);
  };

  // TinyMCE editor height to fit A4 minus toolbar height
  const toolbarHeightPx = 56;
  const a4HeightPx = 1122;
  const contentHeight = a4HeightPx - toolbarHeightPx;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Select form dropdown */}
      <div>
        <label
          htmlFor="form-select"
          className="block mb-2 font-semibold text-gray-700"
        >
          Select Form Template:
        </label>
        <Select
          value={selectedForm}
          onValueChange={(value) => setSelectedForm(value)}
        >
          <SelectTrigger id="form-select" className="w-64">
            <SelectValue placeholder="Choose a form" />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_FORMS.map((form) => (
              <SelectItem key={form} value={form}>
                {form}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TinyMCE Editor */}
      <div
        className="a4-page bg-white rounded shadow mx-auto border border-gray-200"
        style={{
          width: "min(210mm, calc(100vw - 3rem))",
          height: "297mm",
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Editor
          key={formContent + formStyles}
          apiKey={apiKey}
          onInit={(_, editor) => (editorRef.current = editor)}
          initialValue={formContent}
          init={{
            height: contentHeight,
            width: "100%",
            menubar: true,
            plugins: ["table", "lists", "link", "code"],
            toolbar:
              "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table | code",
            content_style: `
              html, body {
                width: 100% !important;
                min-height: ${contentHeight}px !important;
                background: #fff !important;
                margin: 0 auto !important;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                overflow-x: hidden !important;
                overflow-y: auto !important;
                box-sizing: border-box !important;
              }
              * {
                max-width: 100% !important;
                box-sizing: border-box !important;
              }
              table {
                width: 100% !important;
                max-width: 100% !important;
                table-layout: fixed !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                border-collapse: collapse !important;
              }
              td, th {
                word-break: break-word !important;
                overflow-wrap: break-word !important;
                hyphens: auto !important;
                max-width: 0 !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: normal !important;
              }
              img {
                max-width: 100% !important;
                height: auto !important;
              }
              .non-editable {
                background-color: #eee;
                padding: 8px;
                border-radius: 4px;
              }
              ${formStyles}
            `,
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => console.log(editorRef.current?.getContent())}
        >
          Log Content
        </Button>
        <Button onClick={previewPdf}>Preview PDF</Button>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto p-6">
          <DialogHeader>
            <DialogTitle>PDF Preview</DialogTitle>
          </DialogHeader>
          <div
            className="border p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: pdfPreviewHtml }}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={downloadPdf} variant="secondary">
              Download PDF
            </Button>
            <Button onClick={() => setIsPreviewOpen(false)} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
