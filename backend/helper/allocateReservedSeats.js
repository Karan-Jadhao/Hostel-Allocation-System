import { addAllocation } from "./addAllocation.js";

export const allocateReservedSeats = (
    groupedStudentsByBranchAndCategory,
    seatMatrix,
    branches,
    allocations,
    allocationsMap,
    categoryId,
    allocatedSeatsByBranchCategory
) => {
    branches.forEach(branch => {
        let remainingSeats = seatMatrix[categoryId].perBranchSeats;

        const students = groupedStudentsByBranchAndCategory
            .get(branch.id)
            ?.get(categoryId) || [];

        for(const student of students){
            if(remainingSeats === 0) break;

            const success = addAllocation(
                student,
                categoryId,
                allocations,
                allocationsMap
            );

            if(success) {
                remainingSeats--;
                const key = `${branch.id}:${categoryId}`;
                allocatedSeatsByBranchCategory.set(
                    key,
                    (allocatedSeatsByBranchCategory.get(key) || 0) + 1
                );
            }
        }
    })
}
