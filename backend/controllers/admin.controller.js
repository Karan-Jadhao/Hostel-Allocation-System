import { supabase } from "../utils/supabase.js";
import { fetchBranches } from "../helper/fetchBranches.js";
import { fetchCategory } from "../helper/fetchCategories.js";

const hasSelection = ({ academicYear, course, year }) =>
    academicYear && course && year;

export const getApplicants = async (req, res) => {
    try {

        const { academicYear, course, year } = req.query;

        if (!hasSelection(req.query)) {
            return res.status(400).json({
                message: "Select academic year, course and year of study."
            });
        }

        const table =
            year === "First Year"
                ? "firstyear_students"
                : "students";

        const { data: students, error: studentError } = await supabase
            .from(table)
            .select("*")
            .eq("academic_year", academicYear)
            .eq("course", course)
            .eq("year_of_study", year);

        if (studentError) {
            throw new Error(studentError.message);
        }

        const branches = await fetchBranches(
            course
        );

        const categories = await fetchCategory();

        console.log("Students:", students);
        console.log("Branches:", branches);
        console.log("Categories:", categories);

        const branchNames = new Map(
            branches.map(branch => [
                branch.id,
                branch.branch_name
            ])
        );

        const categoryNames = new Map(
            categories.map(category => [
                category.id,
                category.category_name
            ])
        );

        const applicants = (students ?? []).map(student => ({

            id: student.id,

            name: student.name,

            applicationNo:
                student.application_number ||
                student.roll_number ||
                "-",

            branch:
                branchNames.get(student.branch_id) || "-",

            year_of_study: student.year_of_study,

            category:
                categoryNames.get(student.category_id) || "-",

            merit:
                year === "First Year"
                    ? student.rank
                    : student.cgpa,

            email:
                student.email,

            phone:
                student.personal_phone

        }));

        return res.status(200).json(applicants);

    } catch (error) {

        console.error("getApplicants Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
