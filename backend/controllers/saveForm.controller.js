import { supabase } from "../utils/supabase.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { getFormStatus } from "../services/formStatus.service.js";

export const submitApplication = async (req, res) => {
    try {
        const {
            fullName,
            rollNo,
            academicYear,
            course,
            selectedBranch,
            year,
            cgpa,
            competitiveRank,
            email,
            phone,
            parentPhone,
            selectedCategory,
            place,
        } = req.body;

        const { isLive } = await getFormStatus(
            academicYear,
            course,
            year,
        );

        if (!isLive) {
            return res.status(403).json({
                success: false,
                message: "Applications are currently closed.",
            });
        }

        const files = req.files || {};

        const resultUrl = files.resultFile
            ? await uploadToCloudinary(
                  files.resultFile[0].buffer,
                  files.resultFile[0].originalname
              )
            : null;

        const feesReceiptUrl = files.feesReceipt
            ? await uploadToCloudinary(
                  files.feesReceipt[0].buffer,
                  files.feesReceipt[0].originalname
              )
            : null;

        const hostelIdUrl = files.hostelId
            ? await uploadToCloudinary(
                  files.hostelId[0].buffer,
                  files.hostelId[0].originalname
              )
            : null;

        const collegeIdUrl = files.collegeId
            ? await uploadToCloudinary(
                  files.collegeId[0].buffer,
                  files.collegeId[0].originalname
              )
            : null;

        const admissionLetterUrl = files.admissionLetter
            ? await uploadToCloudinary(
                  files.admissionLetter[0].buffer,
                  files.admissionLetter[0].originalname
              )
            : null;

        const aadhaarUrl = files.aadhaarCard
            ? await uploadToCloudinary(
                  files.aadhaarCard[0].buffer,
                  files.aadhaarCard[0].originalname
              )
            : null;

        const isFirstYear = year === "First Year";

        const table = isFirstYear
            ? "firstyear_students"
            : "students";

        let applicationData;

        if (isFirstYear) {
            applicationData = {
                name: fullName,
                academic_year: academicYear,
                course,
                branch_id: Number(selectedBranch),
                year_of_study: year,
                application_number: rollNo,
                score: Number(cgpa),
                rank: Number(competitiveRank),
                email,
                personal_phone: phone,
                parent_phone: parentPhone,
                category_id: Number(selectedCategory),
                native_place: place,
                latest_result: resultUrl,
                admission_letter: admissionLetterUrl,
                adhar_card: aadhaarUrl,
            };
        } else {
            applicationData = {
                name: fullName,
                academic_year: academicYear,
                course,
                branch_id: Number(selectedBranch),
                year_of_study: year,
                roll_number: rollNo,
                cgpa: Number(cgpa),
                email,
                personal_phone: phone,
                parent_phone: parentPhone,
                category_id: Number(selectedCategory),
                native_place: place,
                latest_result: resultUrl,
                hostel_fee_receipt: feesReceiptUrl,
                hostel_id: hostelIdUrl,
                college_id: collegeIdUrl,
                adhar_card: aadhaarUrl,
            };
        }

        const { data, error } = await supabase
            .from(table)
            .insert(applicationData)
            .select();

        if (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};
