import { supabase } from "../utils/supabase.js";

export const fetchCategory = async () => {
    const { data, error } = await supabase
        .from("categories")
        .select("*");
    if (error) {
        throw new Error(error.message);
    }   
    return data;
}