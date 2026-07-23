export const validateSeatMatrix = (
    seatMatrix,
    branches,
    students,
    categories,
    openCategoryId
) => {

    // Basic validation
    if (!seatMatrix || Object.keys(seatMatrix).length === 0) {
        throw new Error("Seat matrix has not been configured.");
    }

    if (!branches?.length) {
        throw new Error("No branches found for the selected course.");
    }

    if (!students?.length) {
        throw new Error("No student applications found.");
    }

    if (!categories?.length) {
        throw new Error("No categories found.");
    }

    if (!seatMatrix[openCategoryId]) {
        throw new Error("Open category seat configuration is missing.");
    }

    const categoryIds = new Set(categories.map(category => category.id));
    const branchIds = new Set(branches.map(branch => branch.id));

    // Validate seat matrix categories
    for (const categoryId of Object.keys(seatMatrix).map(Number)) {
        if (!categoryIds.has(categoryId)) {
            throw new Error(`Seat matrix contains an invalid category (${categoryId}).`);
        }
    }

    // Validate every category has a seat configuration
    for (const category of categories) {

        const seats = seatMatrix[category.id];

        if (!seats) {
            throw new Error(`${category.category_name} seat configuration is missing.`);
        }

        if (
            seats.perBranchSeats === undefined ||
            seats.extraSeats === undefined
        ) {
            throw new Error(`${category.category_name} seat configuration is incomplete.`);
        }

        if (seats.perBranchSeats < 0 || seats.extraSeats < 0) {
            throw new Error(`${category.category_name} seat counts cannot be negative.`);
        }

        // Hostel Rules
        if (category.id === openCategoryId) {

            if (seats.perBranchSeats !== 4) {
                throw new Error("Open category must have exactly 4 seats per branch.");
            }

        } else {

            if (seats.perBranchSeats !== 1) {
                throw new Error(
                    `${category.category_name} must have exactly 1 base seat per branch.`
                );
            }

            if (seats.extraSeats !== 1) {
                throw new Error(
                    `${category.category_name} must have exactly 1 extra seat.`
                );
            }

        }
    }

    // Validate students
    const rollNumbers = new Set();

    for (const student of students) {

        if (rollNumbers.has(student.roll_no)) {
            throw new Error(`Duplicate roll number found: ${student.roll_no}`);
        }

        rollNumbers.add(student.roll_no);

        if (!branchIds.has(student.branch_id)) {
            throw new Error(
                `${student.name} belongs to an invalid branch.`
            );
        }

        if (!categoryIds.has(student.category_id)) {
            throw new Error(
                `${student.name} belongs to an invalid category.`
            );
        }

        const cgpa = Number(student.cgpa);

        if (
            !Number.isFinite(cgpa) ||
            cgpa < 0 ||
            cgpa > 10
        ) {
            throw new Error(
                `${student.name} has an invalid CGPA.`
            );
        }
    }

};