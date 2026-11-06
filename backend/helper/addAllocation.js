export const addAllocation = (
    student,
    categoryId,
    allocations,
    allocationsMap,
    allocationType = "REGULAR"
) => {

    if (allocationsMap.has(student.id))
        return false;

    allocations.push({
        student_id: student.id,
        branch_id: student.branch_id,
        category_id: categoryId,
        allocation_type: allocationType

    });

    allocationsMap.set(
        student.id,
        categoryId
    );

    return true;

};
