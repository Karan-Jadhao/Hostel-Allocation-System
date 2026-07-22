import express from "express"
import { allocationController } from "../controllers/allocation.controller.js";

const allocationRouter = express.Router();

allocationRouter.post("/", allocationController)

export default allocationRouter