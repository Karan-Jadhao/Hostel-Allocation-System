import { buildAllocationResults } from "../helper/buildAllocationResults.js";
import { fetchAllocations } from "../helper/fetchAllocations.js";
import { fetchBranches } from "../helper/fetchBranches.js";
import { fetchCategory } from "../helper/fetchCategories.js";
import { fetchStudents } from "../helper/fetchStudents.js";
import { getAllocations } from "../helper/getAllocations.js";
import { sortStudents } from "../helper/sortStudents.js";
import { generatePDF } from "../services/pdf.service.js";
import { getSeatMatrix } from "../services/seatMatrix.service.js";
import { allocationTemplate } from "../template/allocation.template.js";
import { applicantsTemplate } from "../template/applicants.template.js";
import { seatMatrixTemplate } from "../template/seatMatrix.template.js";

export const downloadSeatMatrix = async (req, res) => {
    try {
        const { academicYear, course, year } = req.query;

        const seatMatrix = await getSeatMatrix(
            academicYear,
            course,
            year
        );

        const categories = await fetchCategory();
        const branches = await fetchCategory(course);

        const html = seatMatrixTemplate({
            academicYear,
            course,
            year,
            seatMatrix,
            categories,
            branchCount: branches.length,
            generatedAt: new Date().toLocaleString(),
        });

        const pdf = await generatePDF(html);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                'attachment; filename="SeatMatrixReport.pdf"',
        });

        res.send(pdf);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate seat matrix report.",
        });
    }
};

export const downloadApplicants = async (req, res) => {
    try {
        const { academicYear, course, year } = req.query;

        const students = await fetchStudents(
            academicYear,
            course,
            year
        );
        const branches = await fetchBranches(course)
        const categories = await fetchCategory();

        const applicants = sortStudents(
            students,
            year
        )
        console.log(applicants.length);
        

        const html = applicantsTemplate({
            academicYear,
            course,
            year,
            applicants,
            branches,
            categories,
            generatedAt: new Date().toLocaleString(),
        });

        const pdf = await generatePDF(html);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                'attachment; filename="ApplicantsReport.pdf"',
        });

        res.send(pdf);


    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate applicants report.",
        });
    }
};

export const downloadAllocations = async (req, res) => {
    try {
        const {
            academicYear,
            course,
            year
        } = req.query;

        const students = await fetchAllocations(
            academicYear,
            course,
            year
        );
        const branches = await fetchBranches(
            course
        );
        const categories = await fetchCategory();
        const allocations = await getAllocations(
            academicYear,
            course,
            year
        );

        const results = buildAllocationResults(
            allocations,
            students,
            branches,
            categories,
            year
        );

        const allottedStudents = results.filter(
            student => student.allocated
        );

        //console.log(allocations);
        console.log(allocations.length);
        console.log(results.length);

        const html = allocationTemplate({
            academicYear,
            course,
            year,
            results,
            totalApplicants: results.length,
            allocatedCount: allottedStudents.length,
            notAllocatedCount: students.length - allottedStudents.length,
            generatedAt: new Date().toLocaleString(),
        });

        const pdf = await generatePDF(html);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                'attachment; filename="AllocationReport.pdf"',
        });

        res.send(pdf);
    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate allocation report.",
        });

    }
};
