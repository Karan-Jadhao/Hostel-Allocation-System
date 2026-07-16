import express from "express"
import { supabase } from "../utils/supabase.js";

formRouter = express.Router()

formRouter.post("/submit", async (req, res) => {
    try {
        const {
        fullName,
        rollNo,
        academicYear,
        course,
        branch,
        year,
        cgpa,
        phone,
        parentPhone,
        category,
        nativePlace
    } = req.body;
        console.log(req.body);

        const { data, error } = await supabase
                                      .from("students")
                                      .insert({
                                        fullName: name,
                                        rollNo: roll_no,
                                        academicYear: academic_year,
                                        
                                      })
    } catch (error) {
        
    }

})