import express from "express";
import cors from "cors";
import rfpRoutes from "./src/routes/rfpRoutes.js";
import vendorRoutes from "./src/routes/vendorRoutes.js";
import proposalRoutes from "./src/routes/proposalRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/rfps", rfpRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/documents", documentRoutes);

export default app;
