import express from "express";
import { allocateHostel } from "../controllers/allocation.controller.js";

const allocationRouter = express.Router();

allocationRouter.post("/", allocateHostel);

export default allocationRouter;