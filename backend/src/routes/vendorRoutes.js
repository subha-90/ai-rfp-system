import { Router } from "express";
import { createVendor, listVendors, mapVendorToRfp } from "../controllers/vendorController.js";

const router = Router();

// Create a vendor
router.post("/", createVendor);

// List all vendors
router.get("/", listVendors);

// Map vendor → RFP
router.post("/map", mapVendorToRfp);

export default router;
