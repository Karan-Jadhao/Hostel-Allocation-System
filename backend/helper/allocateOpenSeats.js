import { addAllocation } from "./addAllocation.js";

export const allocateOpenSeats = (
    groupedStudents,
    seatMatrix,
    branches,
    allocations,
    allocationsMap
) => {

    branches.forEach(branch => {

        let remainingSeats =
            seatMatrix[1].perBranchSeats;

        const students =
            groupedStudents.get(branch.id) || [];

        for (const student of students) {

            if (remainingSeats === 0)
                break;

            const success = addAllocation(
                student,
                1,
                allocations,
                allocationsMap
            );

            if (success) {
                remainingSeats--;
            }

        }

    });

};