import { supabase } from "../utils/supabase.js";

export const fetchBranches = async (course) => {
    const { data, error } = await supabase
        .from("branches")
        .select("*")
        .eq("Course", course);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}