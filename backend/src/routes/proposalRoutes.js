import { Router } from "express";
import { submitProposal, listProposals, evaluateProposals } from "../controllers/proposalController.js";

const router = Router();

// Vendor submits proposal
router.post("/submit", submitProposal);

// List all proposals for an RFP
router.get("/rfp/:rfpId", listProposals);

// AI scoring for all proposals
router.post("/evaluate/:rfpId", evaluateProposals);

export default router;
