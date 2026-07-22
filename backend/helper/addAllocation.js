export const addAllocation = (
    student,
    categoryId,
    allocations,
    allocationsMap
) => {

    if (allocationsMap.has(student.id))
        return false;

    allocations.push({
        student_id: student.id,
        branch_id: student.branch_id,
        category_id: categoryId

    });

    allocationsMap.set(
        student.id,
        categoryId
    );

    return true;

};