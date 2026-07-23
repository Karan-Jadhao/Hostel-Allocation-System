import express from "express";
import { downloadAllocations, downloadApplicants, downloadSeatMatrix } from "../controllers/report.controller.js";

const reportRouter = express.Router();

reportRouter.get("/seat-matrix", downloadSeatMatrix);
reportRouter.get("/applicants", downloadApplicants);
reportRouter.get("/allocations", downloadAllocations);
reportRouter.get("/allocation", downloadAllocations);

export default reportRouter;
