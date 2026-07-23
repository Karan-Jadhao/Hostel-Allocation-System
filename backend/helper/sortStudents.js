export const sortStudents = (students, year) => {
    const meritOf = (student) =>
        Number(year === "First Year" ? student.rank : student.cgpa);

    return [...students].sort((a, b) => {
        const meritDifference = year === "First Year"
            ? meritOf(a) - meritOf(b)
            : meritOf(b) - meritOf(a);

        if (meritDifference !== 0) return meritDifference;

        // A published, immutable tie-breaker keeps reruns auditable.
        return String(a.application_number ?? a.roll_number ?? a.id)
            .localeCompare(String(b.application_number ?? b.roll_number ?? b.id));
    });
};
