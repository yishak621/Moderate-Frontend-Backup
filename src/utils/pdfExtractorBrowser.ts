/**
 * Browser-compatible PDF Text Extraction Utility
 *
 * This utility extracts text content from PDF files in the browser.
 * Uses pdfjs-dist for client-side text extraction.
 */

// @ts-expect-error pdfjs legacy build does not ship TypeScript declarations
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

// Set up PDF.js worker
if (typeof window !== "undefined") {
  const PDF_WORKER_SRC = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  GlobalWorkerOptions.workerSrc =
    GlobalWorkerOptions.workerSrc || PDF_WORKER_SRC;
}

export interface PDFExtractionResult {
  text: string;
  numPages: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
  };
}

/**
 * Extract text content from a PDF file in the browser
 * @param file - File object from file input
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDFBrowser(
  file: File
): Promise<PDFExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    const numPages = pdf.numPages;
    let fullText = "";
    const metadata = await pdf.getMetadata();

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n";
    }

    return {
      text: fullText.trim(),
      numPages,
      metadata: {
        title: metadata?.info?.Title,
        author: metadata?.info?.Author,
        subject: metadata?.info?.Subject,
        creator: metadata?.info?.Creator,
        producer: metadata?.info?.Producer,
      },
    };
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to extract PDF text: ${error.message}`
        : "Failed to extract PDF text"
    );
  }
}
