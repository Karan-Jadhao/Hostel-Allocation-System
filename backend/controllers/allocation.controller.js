import { runAllocationAlgorithm } from "../services/allocationService.js";

export const allocateHostel = async (req, res) => {
    try {

        const allottedStudents = await runAllocationAlgorithm();

        if (!allottedStudents || allottedStudents.length === 0) {
    return res.status(404).json({
        success: false,
        message: "No students could be allotted."
    });
}

        return res.status(200).json({
            success: true,
            message: "Hostel allocation completed successfully.",
            totalAllocated: allottedStudents.length,
            data: allottedStudents
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};