import { supabase } from "../utils/supabase.js"

export const updateHostelliteStatus = async (studentTable, studentIds) => {
    const { error } = await supabase
        .from(studentTable)
        .update({ is_hostelite: true })
        .in("id", studentIds);
    if (error) {
        throw new Error(error.message);
    }
}