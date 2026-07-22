import { addAllocation } from "./addAllocation.js";

export const allocateReservedSeats = (
    groupedStudents,
    seatMatrix,
    branches,
    allocations,
    allocationsMap,
    categoryId
) => {
    branches.forEach(branch => {
        let remainingSeats = seatMatrix[categoryId].perBranchSeats;

        const students = groupedStudents.get(branch.id) || [];

        for(const student of students){
            if(remainingSeats === 0) break;
            if(student.category_id != categoryId) continue;

            const success = addAllocation(
                student,
                categoryId,
                allocations,
                allocationsMap
            );

            if(success) remainingSeats--;
        }
    })
}
