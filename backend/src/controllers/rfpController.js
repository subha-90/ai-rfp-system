import { prisma } from "../config/db.js";
import { generateRfpFromText, compareProposals } from "../services/aiService.js";
import { extractTextFromFile } from "../services/aiService.js";  // for future document parsing

/* ============================================================
   1️⃣ CREATE RFP FROM RAW TEXT (AI-Driven)
   ============================================================ */
export async function createRfpFromText(req, res) {
  try {
    const { text, createdBy } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    // Step 1: AI → convert text to structured RFP JSON
    const structured = await generateRfpFromText(text);

    // Step 2: Save RFP in database
    const rfp = await prisma.rfp.create({
      data: {
        title: structured.title || "Untitled RFP",
        description: structured.summary || text,
        category: structured.category || null,
        status: "draft",
        createdBy: createdBy ? Number(createdBy) : null,
      },
    });

    return res.status(201).json({
      message: "AI-generated RFP created successfully",
      rfp,
      structuredJson: structured,
    });
  } catch (err) {
    console.error("createRfpFromText Error:", err);
    return res.status(500).json({ message: "Failed to create RFP from text" });
  }
}

/* ============================================================
   2️⃣ MANUAL RFP CREATION (Form Based)
   ============================================================ */
export async function createRFP(req, res) {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const rfp = await prisma.rfp.create({
      data: {
        title,
        description,
        category,
        createdBy: createdBy ? Number(createdBy) : null,
      },
    });

    res.status(201).json({
      message: "RFP created successfully",
      rfp,
    });
  } catch (error) {
    console.error("createRFP Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* ============================================================
   3️⃣ LIST ALL RFPs
   ============================================================ */
export async function listRfps(req, res) {
  try {
    const rfps = await prisma.rfp.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(rfps);
  } catch (error) {
    console.error("listRfps Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* ============================================================
   4️⃣ GET RFP DETAILS (INC. Documents, Vendors, Responses)
   ============================================================ */
export async function getRfpDetail(req, res) {
  try {
    const { id } = req.params;

    const rfp = await prisma.rfp.findUnique({
      where: { id: Number(id) },
      include: {
        documents: true,
        vendorMapping: {
          include: { vendor: true },
        },
        responses: {
          include: { vendor: true },
        },
      },
    });

    if (!rfp) return res.status(404).json({ message: "RFP not found" });

    res.json(rfp);
  } catch (error) {
    console.error("getRfpDetail Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* ============================================================
   5️⃣ EVALUATE ALL PROPOSALS FOR AN RFP (AI Scoring)
   ============================================================ */
export async function evaluateRfpProposals(req, res) {
  try {
    const { id } = req.params;

    const rfp = await prisma.rfp.findUnique({
      where: { id: Number(id) },
      include: { responses: true },
    });

    if (!rfp) return res.status(404).json({ message: "RFP not found" });

    if (!rfp.responses || rfp.responses.length === 0) {
      return res.status(400).json({ message: "No vendor responses found" });
    }

    // Step 1: AI compare proposals
    const evaluations = await compareProposals(
      rfp.description,
      rfp.responses.map((r) => ({
        id: r.id,
        parsedJson: r.scoreJson,
      }))
    );

    // Step 2: Update database with AI scoring
    for (const ev of evaluations) {
      await prisma.vendorResponse.update({
        where: { id: ev.proposalId },
        data: {
          scoreJson: ev.scoreJson,
        },
      });
    }

    const updated = await prisma.vendorResponse.findMany({
      where: { rfpId: rfp.id },
      include: { vendor: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("evaluateRfpProposals Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
