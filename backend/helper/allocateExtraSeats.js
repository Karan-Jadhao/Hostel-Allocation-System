import { addAllocation } from "./addAllocation.js";

export const allocateExtraSeats = (
    waitingList,
    seatMatrix,
    allocations,
    allocationMap,
    categoryId,
    allocatedSeatsByBranchCategory
) => {

    let remainingSeats = seatMatrix[categoryId].remainingExtraSeats;

    for (const student of waitingList) {
        
        if (remainingSeats === 0) {
            break;
        }

        if (allocationMap.has(student.id)) {
            continue;
        }
        const key = `${student.branch_id}:${categoryId}`;
        if ((allocatedSeatsByBranchCategory.get(key) || 0) >= 2) continue;

        const success = addAllocation(
            student,
            categoryId,
            allocations,
            allocationMap
        );
        if (success) {
            remainingSeats--;
            allocatedSeatsByBranchCategory.set(
                key,
                (allocatedSeatsByBranchCategory.get(key) || 0) + 1
            );
        }
    }
    seatMatrix[categoryId].remainingExtraSeats = remainingSeats;
};
