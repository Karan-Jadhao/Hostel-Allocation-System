import { supabase } from "../utils/supabase.js";

// Fetch seat matrix
export const getSeatMatrix = async (
    academicYear,
    course,
    year
) => {

    const { data, error } = await supabase
        .from("seat_configuration")
        .select("*")
        .eq("academic_year", academicYear)
        .eq("course", course)
        .eq("year_of_study", year);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Save / Update seat matrix
export const saveSeatMatrix = async (rows) => {

    const { data, error } = await supabase
        .from("seat_configuration")
        .upsert(rows)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Delete seat matrix
export const deleteSeatMatrix = async (
    academicYear,
    course,
    year
) => {

    const { error } = await supabase
        .from("seat_configuration")
        .delete()
        .eq("academic_year", academicYear)
        .eq("course", course)
        .eq("year_of_study", year);

    if (error) {
        throw new Error(error.message);
    }

    return true;
};