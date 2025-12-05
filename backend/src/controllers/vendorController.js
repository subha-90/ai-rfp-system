import { prisma } from "../config/db.js";

/* ============================================================
   Create Vendor
   ============================================================ */
export async function createVendor(req, res) {
  try {
    const { vendorName, contactEmail, contactPhone } = req.body;

    if (!vendorName) {
      return res.status(400).json({ message: "vendorName is required" });
    }

    const vendor = await prisma.vendor.create({
      data: {
        vendorName,
        contactEmail,
        contactPhone,
      },
    });

    res.status(201).json({
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error) {
    console.error("createVendor Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ============================================================
   List Vendors
   ============================================================ */
export async function listVendors(req, res) {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(vendors);
  } catch (error) {
    console.error("listVendors Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ============================================================
   Map Vendor to RFP
   ============================================================ */
export async function mapVendorToRfp(req, res) {
  try {
    const { vendorId, rfpId } = req.body;

    if (!vendorId || !rfpId) {
      return res.status(400).json({ message: "vendorId and rfpId required" });
    }

    const mapping = await prisma.vendorRfpMapping.create({
      data: {
        vendorId: Number(vendorId),
        rfpId: Number(rfpId),
      },
    });

    res.status(201).json({
      message: "Vendor mapped to RFP successfully",
      mapping,
    });
  } catch (error) {
    console.error("mapVendorToRfp Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
