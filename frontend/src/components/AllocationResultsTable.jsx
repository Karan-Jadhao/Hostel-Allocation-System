import SectionHeader from "./SectionHeader";

export default function AllocationResultsTable({ results }) {
    if (!results.length) {
        return (
            <section className="results-card">
                <SectionHeader
                    eyebrow="ALLOCATION RESULTS"
                    title="Allocation result"
                />

                <p className="empty-results">
                    Run the allocation from the dashboard to view results here.
                </p>
            </section>
        );
    }

    return (
        <section className="results-card">
            <SectionHeader
                eyebrow="ALLOCATION RESULTS"
                title="Allocation result"
                count={`${results.length} students`}
            />
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Merit</th>
                            <th>Student category</th>
                            <th>Allotted through</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map((student) => (
                            <tr key={student.id}>
                                <td className="student-name">
                                    {student.name}
                                </td>

                                <td>{student.branch}</td>

                                <td>{student.merit ?? "—"}</td>

                                <td>{student.studentCategory}</td>

                                <td>{student.allocatedCategory}</td>

                                <td>
                                    <span
                                        className={`allocation-status ${
                                            student.allocated
                                                ? "allotted"
                                                : "not-allotted"
                                        }`}
                                    >
                                        {student.allocated
                                            ? "Allotted"
                                            : "Not allotted"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}