import { getSeatMatrix } from "./seatMatrix.service.js";

import { buildSeatMatrix } from "../helper/buildSeatMatrix.js";
import { fetchBranches } from "../helper/fetchBranches.js";
import { fetchCategory } from "../helper/fetchCategories.js";
import { fetchStudents } from "../helper/fetchStudents.js";
import { getAllocations } from "../helper/getAllocations.js";

import { validateSeatMatrix } from "../helper/validateSeatMatrix.js";
import {
    groupStudentsByBranch,
    groupStudentsByBranchAndCategory,
} from "../helper/groupStudentsByBranch.js";

import { sortStudents } from "../helper/sortStudents.js";

import { allocateOpenSeats } from "../helper/allocateOpenSeats.js";
import { allocateReservedSeats } from "../helper/allocateReservedSeats.js";
import { allocateExtraSeats } from "../helper/allocateExtraSeats.js";

import { saveAllocations } from "../helper/saveAllocations.js";
import { buildAllocationResults } from "../helper/buildAllocationResults.js";

const normaliseCategoryName = (name) =>
    String(name).trim().toUpperCase();

export const allocateHostelSeats = async (
    academicYear,
    course,
    year
) => {

    const [
        seatRows,
        branches,
        students,
        categories,
        existingAllocations,
    ] = await Promise.all([
        getSeatMatrix(academicYear, course, year),
        fetchBranches(course),
        fetchStudents(academicYear, course, year),
        fetchCategory(),
        getAllocations(academicYear, course, year),
    ]);

    if (existingAllocations.length) {
        throw new Error(
            "Allocation already exists for this academic group. Reset it before allocating again."
        );
    }

    const openCategory = categories.find(
        (category) =>
            normaliseCategoryName(category.category_name) === "OPEN"
    );

    if (!openCategory) {
        throw new Error(
            "The OPEN category is missing from the category master."
        );
    }

    const seatMatrix = buildSeatMatrix(seatRows);

    validateSeatMatrix(
        seatMatrix,
        branches,
        students,
        categories,
        openCategory.id
    );

    const sortedStudents = sortStudents(students);

    const groupedStudents =
        groupStudentsByBranch(
            sortedStudents,
            branches
        );

    const reservedCategoryIds = categories
        .filter(
            (category) =>
                category.id !== openCategory.id
        )
        .map(
            (category) => category.id
        );

    const groupedStudentsByBranchAndCategory =
        groupStudentsByBranchAndCategory(
            sortedStudents,
            branches,
            reservedCategoryIds
        );

    const waitingLists = new Map(
        reservedCategoryIds.map(
            (categoryId) => [categoryId, []]
        )
    );

    for (const student of sortedStudents) {
        waitingLists
            .get(student.category_id)
            ?.push(student);
    }

    const allocations = [];
    const allocationsMap = new Map();

    const allocatedSeatsByBranchCategory =
        new Map();

    // Phase 1 - Allocate Open Seats

    allocateOpenSeats(
        groupedStudents,
        seatMatrix,
        branches,
        allocations,
        allocationsMap,
        openCategory.id
    );

    // Phase 2 - Allocate Base Reserved Seats

    for (const categoryId of reservedCategoryIds) {

        allocateReservedSeats(
            groupedStudentsByBranchAndCategory,
            seatMatrix,
            branches,
            allocations,
            allocationsMap,
            categoryId,
            allocatedSeatsByBranchCategory
        );

    }

    // Phase 3 - Redistribute Extra Seats

    for (const categoryId of reservedCategoryIds) {

        allocateExtraSeats(
            waitingLists.get(categoryId),
            seatMatrix,
            allocations,
            allocationsMap,
            categoryId,
            allocatedSeatsByBranchCategory
        );

    }

    if (allocations.length) {

        await saveAllocations(
            allocations,
            academicYear,
            course,
            year
        );

    }

    return buildAllocationResults(
        allocations,
        students,
        branches,
        categories,
        year
    );

};