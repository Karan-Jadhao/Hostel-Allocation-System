import { supabase} from "../utils/supabase.js";

export const displaySeatMatrix = async (req, res) => {
    const { academicYear, course, year } = req.query;

    const { data, error } = await supabase
        .from("seat_configuration")
        .select("*")
        .eq("academic_year", academicYear)
        .eq("course", course)
        .eq("year_of_study", year);
        
    if (error) {
        return res.status(500)
                   .json({ 
            error: error.message 
        });
    }

    return res.status(200).json(data);
}