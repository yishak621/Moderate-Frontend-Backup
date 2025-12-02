/**
 * PDF Text Extraction Utility
 *
 * This utility extracts text content from PDF files for storage and embedding generation.
 * Uses pdf-parse for server-side text extraction.
 */

import * as pdfParse from "pdf-parse";

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
 * Extract text content from a PDF buffer
 * @param pdfBuffer - Buffer containing PDF file data
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDF(
  pdfBuffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    const data = await pdfParse.default(pdfBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
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

/**
 * Extract text from a PDF file (for use in Next.js API routes)
 * @param file - File object from FormData or File upload
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDFFile(
  file: File | Buffer
): Promise<PDFExtractionResult> {
  let buffer: Buffer;

  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  return extractTextFromPDF(buffer);
}
