import { supabase } from "../utils/supabase.js";

export const getAllocations = async (
    academicYear,
    course,
    year
) => {
    const { data, error } = await supabase
        .from("allocations")
        .select("*")
        .eq("academic_year", academicYear)
        .eq("course", course)
        .eq("year", year)

    if (error) {
        throw new Error(error.message);
    }

    return data;
};