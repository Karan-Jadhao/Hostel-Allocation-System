import { addAllocation } from "./addAllocation.js";

export const allocateOpenSeats = (
    groupedStudents,
    seatMatrix,
    branches,
    allocations,
    allocationsMap,
    openCategoryId
) => {

    branches.forEach(branch => {

        let remainingSeats =
            seatMatrix[openCategoryId].perBranchSeats;

        const students =
            groupedStudents.get(branch.id) || [];

        for (const student of students) {

            if (remainingSeats === 0)
                break;

            const success = addAllocation(
                student,
                openCategoryId,
                allocations,
                allocationsMap
            );

            if (success) {
                remainingSeats--;
            }

        }

    });

};
