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
        allocation_type: allocation.allocation_type || "REGULAR",
        academic_year: academicYear,
        course: course,
        year: year

    }));

    const { data, error } = await supabase.rpc("commit_hostel_allocations", {
        p_academic_year: academicYear,
        p_course: course,
        p_year: year,
        p_student_table: studentTable,
        p_allocations: rows,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};
