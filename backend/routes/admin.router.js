import express from "express";
import { getApplicants } from "../controllers/admin.controller.js";

const adminRouter = express.Router();
adminRouter.get("/applicants", getApplicants);
export default adminRouter;
