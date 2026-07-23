export const groupStudentsByBranch = (students, branches) => {
    const groupedStudents = new Map();

    // Initialize every branch
    branches.forEach(branch => {
        groupedStudents.set(branch.id, []);
    });

    // Group students
    students.forEach(student => {
        groupedStudents.get(student.branch_id)?.push(student);
    });

    return groupedStudents;
};

export const groupStudentsByBranchAndCategory = (students, branches, categoryIds) => {
    const groupedStudents = new Map();

    for (const branch of branches) {
        groupedStudents.set(
            branch.id,
            new Map(categoryIds.map((categoryId) => [categoryId, []]))
        );
    }

    for (const student of students) {
        groupedStudents.get(student.branch_id)
            ?.get(student.category_id)
            ?.push(student);
    }

    return groupedStudents;
};
