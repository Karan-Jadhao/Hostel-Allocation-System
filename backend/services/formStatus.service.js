import { supabase } from "../utils/supabase.js";

export const getFormStatus = async (academicYear, course, year) => {
    const { data, error } = await supabase
        .from("form_status")
        .select("is_live")
        .eq("academic_year", academicYear)
        .eq("course", course)
        .eq("year_of_study", year)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return {
        isLive: data?.is_live === true,
    };
};

export const updateFormStatus = async (
    academicYear,
    course,
    year,
    isLive,
) => {
    const { error } = await supabase
        .from("form_status")
        .upsert(
            {
                academic_year: academicYear,
                course,
                year_of_study: year,
                is_live: isLive,
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: "academic_year,course,year_of_study",
            },
        );

    if (error) {
        throw new Error(error.message);
    }

    return {
        isLive,
    };
};
