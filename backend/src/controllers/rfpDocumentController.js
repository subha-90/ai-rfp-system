import { prisma } from "../config/db.js";
import { extractTextFromFile } from "../services/aiService.js";

export async function uploadRfpDocument(req, res) {
  try {
    const { rfpId } = req.body;
    const file = req.file;

    if (!rfpId) return res.status(400).json({ message: "rfpId is required" });
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Step 1: Extract text from uploaded file using AI
    const extractedText = await extractTextFromFile(file.path);

    // Step 2: Save metadata into DB
    const document = await prisma.rfpDocument.create({
      data: {
        rfpId: Number(rfpId),
        fileName: file.originalname,
        filePath: file.path,
        contentExtracted: extractedText,
      },
    });

    res.status(201).json({
      message: "Document uploaded and processed successfully",
      document,
    });
  } catch (error) {
    console.error("uploadRfpDocument Error:", error);
    res.status(500).json({ message: "Failed to upload RFP document" });
  }
}

