import { allocateHostelSeats } from "../services/allocationService.js";

export const allocationController = async (req, res) => {
    try {
        const {
            academicYear,
            course,
            year
        } = req.body;

        if (!academicYear || !course || !year) {
            return res.status(400).json({ success: false, message: "Academic year, course and year of study are required." });
        }
        const result = await allocateHostelSeats(academicYear, course, year);

        return res.status(200).json({
            success: true,
            message: "Allocation Completed SuccessFully",
            data: result
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message || "Allocation failed." });
    }
}
