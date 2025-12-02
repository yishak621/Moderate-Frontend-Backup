/**
 * File Text Extraction Utility
 * 
 * Extracts text content from various file types in the browser.
 * Used for sending textContent to backend for embedding generation.
 * 
 * Supports:
 * - PDF files (using pdfjs-dist)
 * - Text files (.txt, .md, etc.)
 * - Images (using Tesseract.js OCR)
 */

import { extractTextFromPDFBrowser } from "./pdfExtractorBrowser";
import { createWorker } from "tesseract.js";

/**
 * Extract text from image using OCR (Tesseract.js)
 * @param file - Image file (jpg, png, gif, bmp, etc.)
 * @returns Extracted text string, or empty string if extraction fails
 */
async function extractTextFromImage(file: File): Promise<string> {
  try {
    // Create Tesseract worker
    const worker = await createWorker("eng"); // English language
    
    // Perform OCR on the image
    const {
      data: { text },
    } = await worker.recognize(file);
    
    // Terminate worker to free resources
    await worker.terminate();
    
    // Clean up the text (remove extra whitespace)
    const cleanedText = text.trim().replace(/\s+/g, " ");
    
    return cleanedText;
  } catch (error) {
    console.error(`OCR extraction failed for ${file.name}:`, error);
    return "";
  }
}

/**
 * Check if a file is an image type
 */
function isImageFile(file: File): boolean {
  return (
    file.type.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(file.name)
  );
}

/**
 * Extract text content from a file (PDF, TXT, Images, etc.)
 * @param file - File object from file input
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns Extracted text string, or empty string if extraction fails or not supported
 */
export async function extractTextFromFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Extract text from PDF files
    if (file.type === "application/pdf") {
      const result = await extractTextFromPDFBrowser(file);
      return result.text;
    }

    // Extract text from text files
    if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md")
    ) {
      return await file.text();
    }

    // Extract text from images using OCR
    if (isImageFile(file)) {
      onProgress?.(10); // Start OCR
      const text = await extractTextFromImage(file);
      onProgress?.(100); // Complete
      return text;
    }

    // For unsupported types, return empty string
    // (Backend won't generate embeddings without textContent)
    return "";
  } catch (error) {
    console.warn(`Failed to extract text from ${file.name}:`, error);
    return "";
  }
}

