import {
    getFormStatus,
    updateFormStatus,
} from "../services/formStatus.service.js";

const hasSelection = (academicYear, course, year) =>
    academicYear && course && year;

export const getApplicationStatus = async (req, res) => {
    try {
        const { academicYear, course, year } = req.query;

        if (!hasSelection(academicYear, course, year)) {
            return res.status(400).json({
                success: false,
                message: "Academic year, course and year of study are required.",
            });
        }

        const { isLive } = await getFormStatus(
            academicYear,
            course,
            year,
        );

        return res.status(200).json({
            success: true,
            isLive,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Unable to fetch application status.",
        });
    }
};

export const setApplicationStatus = async (req, res) => {
    try {
        const {
            academicYear,
            course,
            year,
            isLive,
        } = req.body;

        if (!hasSelection(academicYear, course, year)) {
            return res.status(400).json({
                success: false,
                message: "Academic year, course and year of study are required.",
            });
        }

        if (typeof isLive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Application status must be true or false.",
            });
        }

        await updateFormStatus(academicYear, course, year, isLive);

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Unable to update application status.",
        });
    }
};
