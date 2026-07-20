import express from "express";
import { allocateHostel, getAllocationDashboardSummary } from "../controllers/allocation.controller.js";

const allocationRouter = express.Router();

allocationRouter.get("/summary", getAllocationDashboardSummary);
allocationRouter.post("/", allocateHostel);

export default allocationRouter;
