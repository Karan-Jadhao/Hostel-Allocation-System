export const groupStudentsByBranch = (students, branches) => {
    const groupedStudents = new Map();

    branches.forEach(branch => {
        groupedStudents.set(
            branch.id,
            students.filter(student => student.branch_id === branch.id)
        );
    });

    return groupedStudents;
};