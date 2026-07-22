import { supabase} from "../utils/supabase.js";

export const fetchStudents = async(academicYear, course, year) => {
    const table = 
    year === "First Year" ? 
    "firstyear_students" : "students";

    const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("academic_year", academicYear)
        .eq("course", course)
        .eq("year", year)
        .eq("is_hostelite", false);
    
    if (error) {
        throw new Error(error.message);
    }

    if(year === "First Year") {
        return data.map(student => ({
            ...student,
            meritValue: student.rank,
            identifier: student.application_number
        }));
    }

    return data.map(student => ({
        ...student,
        meritValue: student.cgpa,
        identifier: student.roll_number
    }));
}
