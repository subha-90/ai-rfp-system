import { prisma } from "../config/db.js";
import { parseVendorEmail, compareProposals } from "../services/aiService.js";

/* ============================================================
   1️⃣ Vendor submits proposal (text/email)
   ============================================================ */
export async function submitProposal(req, res) {
  try {
    const { rfpId, vendorId, rawText } = req.body;

    if (!rfpId || !vendorId || !rawText) {
      return res.status(400).json({ message: "rfpId, vendorId, and rawText are required" });
    }

    // AI → parse vendor proposal
    const parsedJson = await parseVendorEmail(rawText);

    // Save proposal
    const proposal = await prisma.vendorResponse.create({
      data: {
        rfpId: Number(rfpId),
        vendorId: Number(vendorId),
        responseText: rawText,
        scoreJson: parsedJson
      },
    });

    res.status(201).json({
      message: "Proposal submitted and parsed successfully",
      proposal,
    });
  } catch (error) {
    console.error("submitProposal Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/* ============================================================
   2️⃣ List proposals for a specific RFP
   ============================================================ */
export async function listProposals(req, res) {
  try {
    const { rfpId } = req.params;

    const proposals = await prisma.vendorResponse.findMany({
      where: { rfpId: Number(rfpId) },
      include: { vendor: true },
    });

    res.json(proposals);
  } catch (error) {
    console.error("listProposals Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/* ============================================================
   3️⃣ Evaluate all vendor proposals for an RFP using AI
   ============================================================ */
export async function evaluateProposals(req, res) {
  try {
    const { rfpId } = req.params;

    // Fetch RFP
    const rfp = await prisma.rfp.findUnique({
      where: { id: Number(rfpId) },
    });

    if (!rfp) return res.status(404).json({ message: "RFP not found" });

    // Fetch all proposals
    const responses = await prisma.vendorResponse.findMany({
      where: { rfpId: Number(rfpId) },
    });

    if (responses.length === 0) {
      return res.status(400).json({ message: "No proposals found for this RFP" });
    }

    // Prepare for AI scoring
    const proposalsFormatted = responses.map((resp) => ({
      proposalId: resp.id,
      parsedJson: resp.scoreJson,
    }));

    // AI scoring
    const evaluations = await compareProposals(
      rfp.description,
      proposalsFormatted
    );

    // Save scores
    for (const ev of evaluations) {
      await prisma.vendorResponse.update({
        where: { id: ev.proposalId },
        data: {
          scoreJson: ev.scoreJson,
        },
      });
    }

    const updated = await prisma.vendorResponse.findMany({
      where: { rfpId: Number(rfpId) },
      include: { vendor: true },
    });

    res.json({
      message: "AI evaluation completed",
      evaluations: updated,
    });
  } catch (error) {
    console.error("evaluateProposals Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
