import { supabase } from "../utils/supabase.js";

export const resetAllocation = async (req, res) => {
    const { academicYear, course, year } = req.body;

    const { error } = await supabase.rpc("reset_allocation", {
        p_academic_year: academicYear,
        p_course: course,
        p_year: year,
    });

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

    res.json({
        success: true,
        message: "Allocation reset successfully.",
    });
};