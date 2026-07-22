import {
    getSeatMatrix
} from "../services/seatMatrix.service.js";

import {
    deleteSeatMatrix
} from "../services/seatMatrix.service.js";

import {
    saveSeatMatrix
} from "../services/seatMatrix.service.js";

//diplay seat matrix
export const displaySeatMatrix = async (req, res) => {

    try {
        const {
            academicYear,
            course,
            year
        } = req.query;

        const data = await getSeatMatrix(
            academicYear,
            course,
            year
        );

        res.json(data);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

//upload seat matrix
export const uploadSeatMatrix = async (req, res) => {
    try {
        const {
            academicYear,
            course,
            year,
            seatConfig
        } = req.body;

        const rows = Object.entries(seatConfig).map(([categoryId, seats]) => ({
            academic_year: academicYear,
            course,
            year_of_study: year,
            category_id: Number(categoryId),
            per_branch_seats: seats.perBranchSeats,
            extra_seats: seats.extraSeats,
        }));

        const data = await saveSeatMatrix(rows);
        res.status(201).json({
            success: true,
            data
        });
    }

    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

//delete seat matrix
export const removeSeatMatrix = async (req, res) => {
    try {
        const {
            academicYear,
            course,
            year

        } = req.body;

        await deleteSeatMatrix(
            academicYear,
            course,
            year

        );

        res.json({
            success: true,
            message: "Deleted"
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });

    }

}