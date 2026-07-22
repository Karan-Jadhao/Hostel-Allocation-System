export const sortStudents = (students, year) => {

    return [...students].sort((a, b) => {
        if (year === "First Year") {
            return a.meritValue - b.meritValue;
        }
        return b.meritValue - a.meritValue;

    });
};