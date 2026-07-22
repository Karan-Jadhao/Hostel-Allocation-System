import { addAllocation } from "./addAllocation.js";

export const allocateExtraSeats = (
    students,
    seatMatrix,
    allocations,
    allocationMap,
    categoryId
) => {

    let remainingSeats = seatMatrix[categoryId].remainingExtraSeats;

    for (const student of students) {
        
        if (remainingSeats === 0) {
            break;
        }

        if (student.category_id !== categoryId) {
            continue;
        }

        if (allocationMap.has(student.id)) {
            continue;
        }
        const success = addAllocation(
            student,
            categoryId,
            allocations,
            allocationMap
        );
        if (success) {
            remainingSeats--;
        }
    }
    seatMatrix[categoryId].remainingExtraSeats = remainingSeats;
};
