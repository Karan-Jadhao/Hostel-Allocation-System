import { supabase } from "../utils/supabase.js";

export const saveAllocations = async (
    allocations,
    academicYear,
    course,
    year
) => {

    const studentTable =
        year === "First Year"
            ? "firstyear_students"
            : "students";

    const rows = allocations.map(allocation => ({
        student_id: allocation.student_id,
        student_table: studentTable,
        branch_id: allocation.branch_id,
        category_id: allocation.category_id,
        academic_year: academicYear,
        course: course,
        year_of_study: year

    }));

    const { data, error } = await supabase
        .from("allocations")
        .insert(rows)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};