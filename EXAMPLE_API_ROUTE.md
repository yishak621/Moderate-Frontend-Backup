# Example: PDF Text Extraction API Route

This is an example of how to implement PDF text extraction in a Next.js API route or your backend.

## Next.js API Route Example

Create: `src/app/api/files/extract-pdf/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDFFile } from "@/utils/pdfExtractor";
import { generateEmbedding } from "@/utils/embedding"; // Your Ollama embedding function
import { db } from "@/lib/db"; // Your database connection

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const uploadId = formData.get("uploadId") as string;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file type. Expected PDF." },
        { status: 400 }
      );
    }

    // 1. Extract text from PDF
    const { text, numPages, metadata } = await extractTextFromPDFFile(file);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text content found in PDF" },
        { status: 400 }
      );
    }

    // 2. Generate embedding using Ollama phi3.5
    const embedding = await generateEmbedding(text);

    // 3. Store text content in database
    const textResult = await db.query(
      `INSERT INTO exam_files (upload_id, filename, content, num_pages, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [uploadId, file.name, text, numPages, JSON.stringify(metadata)]
    );

    const fileId = textResult.rows[0].id;

    // 4. Store embedding in separate table
    await db.query(
      `INSERT INTO exam_file_embeddings (file_id, embedding, created_at)
       VALUES ($1, $2, NOW())`,
      [fileId, JSON.stringify(embedding)]
    );

    return NextResponse.json({
      success: true,
      fileId,
      textLength: text.length,
      numPages,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

## Backend Service Example (Separate Backend)

If you have a separate backend (Express, NestJS, etc.):

```typescript
import express from "express";
import multer from "multer";
import { extractTextFromPDF } from "./utils/pdfExtractor";
import { generateEmbedding } from "./utils/embedding";
import { db } from "./db";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/api/files/extract-pdf",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file || req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Invalid file type" });
      }

      const { uploadId } = req.body;
      const pdfBuffer = req.file.buffer;

      // 1. Extract text
      const { text, numPages, metadata } = await extractTextFromPDF(pdfBuffer);

      // 2. Generate embedding
      const embedding = await generateEmbedding(text);

      // 3. Store in database
      const textResult = await db.query(
        `INSERT INTO exam_files (upload_id, filename, content, num_pages, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
        [
          uploadId,
          req.file.originalname,
          text,
          numPages,
          JSON.stringify(metadata),
        ]
      );

      const fileId = textResult.rows[0].id;

      // 4. Store embedding
      await db.query(
        `INSERT INTO exam_file_embeddings (file_id, embedding)
       VALUES ($1, $2)`,
        [fileId, JSON.stringify(embedding)]
      );

      res.json({
        success: true,
        fileId,
        textLength: text.length,
        numPages,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Failed to process PDF",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
```

## Database Schema Example

```sql
-- Table for storing extracted text
CREATE TABLE exam_files (
  id SERIAL PRIMARY KEY,
  upload_id VARCHAR(255) NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  num_pages INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table for storing embeddings (PGVector)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE exam_file_embeddings (
  id SERIAL PRIMARY KEY,
  file_id INTEGER REFERENCES exam_files(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- Adjust dimension based on your model
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(file_id)
);

-- Index for similarity search
CREATE INDEX ON exam_file_embeddings USING ivfflat (embedding vector_cosine_ops);
```

## Embedding Generation Example

Create: `src/utils/embedding.ts`

```typescript
/**
 * Generate embeddings using Ollama phi3.5
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3.5",
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}
```

## Usage from Frontend

```typescript
// After file upload, trigger text extraction
const handlePDFUpload = async (file: File, uploadId: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploadId", uploadId);

  const response = await fetch("/api/files/extract-pdf", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  console.log("Extracted text length:", result.textLength);
};
```
