const RESERVED_CATEGORY_RULES = {
    OBC: { perBranchSeats: 2, extraSeats: 0 },
    SC: { perBranchSeats: 1, extraSeats: 4 },
    ST: { perBranchSeats: 0, extraSeats: 7 },
    VJDTNT: { perBranchSeats: 1, extraSeats: 2 },
    EWS: { perBranchSeats: 1, extraSeats: 1 },
    SEBC: { perBranchSeats: 1, extraSeats: 1 },
    ORPHAN: { perBranchSeats: 0, extraSeats: 1 },
};

const normaliseCategoryName = (name) => String(name)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

export const validateSeatMatrix = (
    seatMatrix,
    branches,
    students,
    categories,
    openCategoryId,
    year
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

        // OTHER applicants receive an allocation outside the seat matrix.
        if (normaliseCategoryName(category.category_name) === "OTHER") {
            continue;
        }

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

            const categoryName = normaliseCategoryName(category.category_name);

            const categoryRule = RESERVED_CATEGORY_RULES[categoryName] ?? {
                perBranchSeats: 1,
                extraSeats: 1,
            };

            if (seats.perBranchSeats !== categoryRule.perBranchSeats) {
                throw new Error(
                    `${category.category_name} must have exactly ${categoryRule.perBranchSeats} base seat${categoryRule.perBranchSeats === 1 ? "" : "s"} per branch.`
                );
            }

            const requiredExtraSeats = categoryRule.extraSeats;

            if (seats.extraSeats !== requiredExtraSeats) {
                throw new Error(
                    `${category.category_name} must have exactly ${requiredExtraSeats} extra seat${requiredExtraSeats === 1 ? "" : "s"}.`
                );
            }

        }
    }

    // Validate students
    const studentIdentifiers = new Set();

    for (const student of students) {

        const identifier = year === "First Year"
            ? student.application_number
            : student.roll_no ?? student.roll_number;

        if (!identifier) {
            throw new Error(`${student.name} has no application or roll number.`);
        }

        if (studentIdentifiers.has(identifier)) {
            throw new Error(`Duplicate application or roll number found: ${identifier}`);
        }

        studentIdentifiers.add(identifier);

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

        if (year === "First Year") {
            const rank = Number(student.rank);

            if (!Number.isInteger(rank) || rank < 1) {
                throw new Error(`${student.name} has an invalid competitive exam rank.`);
            }
        } else {
            const cgpa = Number(student.cgpa);

            if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) {
            throw new Error(
                `${student.name} has an invalid CGPA.`
            );
            }
        }
    }

};
