import { getAllocationSummary, runAllocationAlgorithm } from "../services/allocationService.js";

export const getAllocationDashboardSummary = async (req, res) => {
    try {
        const summary = await getAllocationSummary();
        return res.status(200).json({ success: true, data: summary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const allocateHostel = async (req, res) => {
    try {

        const { allocations, results } = await runAllocationAlgorithm();

        return res.status(200).json({
            success: true,
            message: "Hostel allocation completed successfully.",
            totalAllocated: allocations.length,
            data: results
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
