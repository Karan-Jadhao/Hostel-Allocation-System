import { useMemo } from "react";
import SectionHeader from "./SectionHeader";

export default function ApplicantsTable({
    applicants,
    selectionReady,
    selectedYear,
    loading,
}) {

  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
        if (selectedYear === "First Year") {
            // Lower rank is better
            return (a.merit ?? Infinity) - (b.merit ?? Infinity);
        }

        // Higher CGPA is better
        return (b.merit ?? -1) - (a.merit ?? -1);
    });
}, [applicants, selectedYear]);

    return (
        <section className="results-card">
            <SectionHeader
                eyebrow="APPLIED APPLICANTS"
                title="Applicant information"
                description="Applications submitted for the selected academic group."
                count={`${sortedApplicants.length} applicants`}
            />

            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Application / Roll no.</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Category</th>
                            <th>
                                {selectedYear === "First Year"
                                    ? "Rank"
                                    : "CGPA"}
                            </th>
                            <th>Contact</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="empty-results"
                                >
                                    Loading applications…
                                </td>
                            </tr>
                        ) : applicants.length ? (
                            sortedApplicants.map((student) => (
                                <tr key={student.id}>
                                    <td className="student-name">
                                        {student.name}
                                    </td>

                                    <td>{student.applicationNo}</td>

                                    <td>{student.branch}</td>

                                    <td>{student.year_of_study}</td>

                                    <td>{student.category}</td>

                                    <td>{student.merit ?? "—"}</td>

                                    <td>
                                        {student.email ||
                                            student.phone ||
                                            "—"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="empty-results"
                                >
                                    {selectionReady
                                        ? "No applications have been submitted for this group."
                                        : "Select academic details to see applicants."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
