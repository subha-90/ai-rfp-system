import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { uploadRfpDocument } from "../controllers/rfpDocumentController.js";

const router = Router();

router.post("/upload", upload.single("file"), uploadRfpDocument);

export default router;
