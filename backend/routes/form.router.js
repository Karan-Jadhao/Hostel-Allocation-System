import express from "express";
import upload from "../utils/multer.js";
import { submitApplication } from "../controllers/saveForm.controller.js";

const formRouter = express.Router();

const uploadFields = upload.fields([
    { name: "resultFile", maxCount: 1 },
    { name: "feesReceipt", maxCount: 1 },
    { name: "hostelId", maxCount: 1 },
    { name: "collegeId", maxCount: 1 },
    { name: "admissionLetter", maxCount: 1 },
    { name: "aadhaarCard", maxCount: 1 },
]);

formRouter.post("/submit", uploadFields, submitApplication);

export default formRouter;