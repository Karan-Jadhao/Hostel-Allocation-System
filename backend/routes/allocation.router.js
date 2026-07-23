import express from "express"
import { allocationController } from "../controllers/allocation.controller.js";
import { getAllocationResults } from "../controllers/allocationResults.controller.js";
import { resetAllocation } from "../controllers/reset.router.js";

const allocationRouter = express.Router();

allocationRouter.post("/", allocationController)
allocationRouter.get("/", getAllocationResults)
allocationRouter.post("/reset", resetAllocation);

export default allocationRouter
