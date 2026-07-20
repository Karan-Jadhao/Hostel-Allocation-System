import express from "express";
import { supabase } from "../utils/supabase.js";
import cloudinary from "../utils/cloudinary.js";
import upload from "../utils/multer.js";

const formRouter = express.Router();

// Helper: upload a single file buffer to Cloudinary and return the secure URL
function uploadToCloudinary(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "hostel-allocation",
        public_id: `${Date.now()}_${fileName}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(fileBuffer);
  });
}

// Multer middleware for application documents
const uploadFields = upload.fields([
  { name: "resultFile", maxCount: 1 },
  { name: "feesReceipt", maxCount: 1 },
  { name: "hostelId", maxCount: 1 },
  { name: "collegeId", maxCount: 1 },
  { name: "admissionLetter", maxCount: 1 },
  { name: "aadhaarCard", maxCount: 1 },
]);

formRouter.post("/submit", uploadFields, async (req, res) => {
  try {
    // Extract text fields from the form body
    const {
      fullName,
      rollNo,
      academicYear,
      course,
      selectedBranch,
      year,
      cgpa,
      email,
      phone,
      parentPhone,
      selectedCategory,
      place,
    } = req.body;

    // Upload each file to Cloudinary (if provided)
    const files = req.files || {};

    const resultUrl = files.resultFile
      ? await uploadToCloudinary(files.resultFile[0].buffer, files.resultFile[0].originalname)
      : null;

    const feesReceiptUrl = files.feesReceipt
      ? await uploadToCloudinary(files.feesReceipt[0].buffer, files.feesReceipt[0].originalname)
      : null;

    const hostelIdUrl = files.hostelId
      ? await uploadToCloudinary(files.hostelId[0].buffer, files.hostelId[0].originalname)
      : null;

    const collegeIdUrl = files.collegeId
      ? await uploadToCloudinary(files.collegeId[0].buffer, files.collegeId[0].originalname)
      : null;

    const admissionLetterUrl = files.admissionLetter
      ? await uploadToCloudinary(files.admissionLetter[0].buffer, files.admissionLetter[0].originalname)
      : null;

    const aadhaarUrl = files.aadhaarCard
      ? await uploadToCloudinary(files.aadhaarCard[0].buffer, files.aadhaarCard[0].originalname)
      : null;

    // Insert into Supabase students table
    const { data, error } = await supabase.from("students").insert({
      name: fullName,
      roll_no: rollNo,
      academic_year: parseInt(academicYear) || null,
      course: course,
      branch_id: parseInt(selectedBranch) || null,
      year: year,
      cgpa: parseFloat(cgpa) || null,
      email: email,
      phone_personal: phone,
      phone_parent: parentPhone,
      category_id: parseInt(selectedCategory) || null,
      Native_Place: place,
      is_hostelite: false,
      result_pdf_path: resultUrl,
      hostel_fee_receipt_path: feesReceiptUrl,
      hostel_id: hostelIdUrl,
      // First-year applicants use the existing admission-document slot instead of a college ID.
      college_id: collegeIdUrl || admissionLetterUrl,
      adhar: aadhaarUrl,
    }).select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save application",
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: data,
    });
  } catch (err) {
    console.error("Form submission error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

export default formRouter;
