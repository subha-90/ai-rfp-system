import { Router } from "express";
import {
  createRfpFromText,
  createRFP,
  listRfps,
  getRfpDetail,
  evaluateRfpProposals
} from "../controllers/rfpController.js";

const router = Router();

/* ----------------------------------------------
   AI-Generated RFP (from text)
---------------------------------------------- */
router.post("/from-text", createRfpFromText);

/* ----------------------------------------------
   Manual RFP creation (form-based)
---------------------------------------------- */
router.post("/", createRFP);

/* ----------------------------------------------
   Fetch all RFPs
---------------------------------------------- */
router.get("/", listRfps);

/* ----------------------------------------------
   Fetch RFP details
---------------------------------------------- */
router.get("/:id", getRfpDetail);

/* ----------------------------------------------
   AI Proposal Evaluation
---------------------------------------------- */
router.post("/:id/evaluate", evaluateRfpProposals);

export default router;
