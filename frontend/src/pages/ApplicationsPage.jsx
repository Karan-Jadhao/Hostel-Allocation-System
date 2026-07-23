import { FileCheck2, FileSpreadsheet, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AcademicGroupFields from "../components/AcademicGroupFields";
import AdminShell from "../components/AdminShell";
import AllocationResultsTable from "../components/AllocationResultsTable";
import ApplicantsTable from "../components/ApplicantsTable";
import ReportCard from "../components/ReportCard";
import ResultBanner from "../components/ResultBanner";
import api from "../api/axios";
import { useAllocation } from "../context/AllocationContext";
import { downloadReport } from "../utils/downloadReport";
import "../styles/AdminDashboard.css";
import "../styles/ApplicationsPage.css";

const reports = [
    {
        id: "seatMatrix",
        title: "Seat Matrix",
        description: "Download the configured seat matrix for the selected academic group.",
        icon: FileSpreadsheet,
        endpoint: "/reports/seat-matrix",
        fileName: "SeatMatrixReport.pdf",
    },
    {
        id: "applicants",
        title: "Applicants Report",
        description: "Download the complete list of submitted applications.",
        icon: UsersRound,
        endpoint: "/reports/applicants",
        fileName: "ApplicantsReport.pdf",
    },
    {
        id: "allocation",
        title: "Allocation Report",
        description: "Download the final hostel allocation results.",
        icon: FileCheck2,
        endpoint: "/reports/allocations",
        fileName: "AllocationReport.pdf",
    },
];

export default function ApplicationsPage() {
    const allocation = useAllocation();
    const [search, setSearch] = useState("");
    const [branch, setBranch] = useState("");
    const [category, setCategory] = useState("");
    const [generatingReports, setGeneratingReports] = useState({});
    const [reportMessage, setReportMessage] = useState(null);

    const branches = useMemo(
        () => getUniqueValues(allocation.applicants, "branch"),
        [allocation.applicants],
    );
    const categories = useMemo(
        () => getUniqueValues(allocation.applicants, "category"),
        [allocation.applicants],
    );
    const applicants = useMemo(
        () => filterApplicants(allocation.applicants, search, branch, category),
        [allocation.applicants, branch, category, search],
    );
    const allocatedCount = allocation.allocationResults.filter(
        (student) => student.allocated,
    ).length;

    const generateReport = async (report) => {
        if (!allocation.selectionReady || generatingReports[report.id]) {
            return;
        }

        setGeneratingReports((currentReports) => ({
            ...currentReports,
            [report.id]: true,
        }));
        setReportMessage(null);

        try {
            await downloadReport({
                api,
                endpoint: report.endpoint,
                fileName: report.fileName,
                selection: allocation.selection,
            });
        } catch (error) {
            setReportMessage({
                type: "error",
                text: error.response?.data?.message || `Unable to generate the ${report.title.toLowerCase()}.`,
            });
        } finally {
            setGeneratingReports((currentReports) => ({
                ...currentReports,
                [report.id]: false,
            }));
        }
    };

    const handleDownloadSeatMatrix = () => generateReport(reports[0]);
    const handleDownloadApplicants = () => generateReport(reports[1]);
    const handleDownloadAllocation = () => generateReport(reports[2]);
    const reportHandlers = [
        handleDownloadSeatMatrix,
        handleDownloadApplicants,
        handleDownloadAllocation,
    ];
    const selectedGroup = allocation.selectionReady
        ? `${allocation.selection.academicYear} • ${allocation.selection.course} • ${allocation.selection.year}`
        : "Select an academic group to generate reports.";

    return (
        <AdminShell
            activePage="applications"
            applicantCount={allocation.applicants.length}
            breadcrumb={
                <>
                    <Link to="/admin">Dashboard</Link>
                    <span>/</span>
                    Applications
                </>
            }
        >
            <div className="page-heading">
                <div>
                    <p className="eyebrow">APPLICATION MANAGEMENT</p>
                    <h1>Applications and results</h1>
                    <p>{selectedGroup}</p>
                </div>

                <Link className="outline-button" to="/admin">
                    Back to dashboard
                </Link>
            </div>

            <section className="selection-card applications-selection">
                <AcademicGroupFields
                    selection={allocation.selection}
                    updateSelection={allocation.updateSelection}
                />
            </section>

            <section className="applications-summary">
                <Summary
                    label="Total applicants"
                    value={allocation.applicants.length}
                />
                <Summary
                    label="Allocated"
                    value={allocatedCount}
                />
                <Summary
                    label="Not allocated"
                    value={allocation.allocationResults.length - allocatedCount}
                />
            </section>

            <section className="reports-section" aria-labelledby="reports-heading">
                <div className="reports-heading">
                    <div>
                        <p className="eyebrow">REPORTS</p>
                        <h2 id="reports-heading">Download printable reports</h2>
                        <p>Download printable reports for the selected Academic Year, Course and Year.</p>
                    </div>
                    <span className="reports-selected-group">{selectedGroup}</span>
                </div>

                <div className="reports-grid">
                    {reports.map((report, index) => (
                        <ReportCard
                            key={report.id}
                            {...report}
                            isGenerating={Boolean(generatingReports[report.id])}
                            onDownload={reportHandlers[index]}
                        />
                    ))}
                </div>
            </section>

            <ResultBanner
                message={reportMessage || allocation.message}
                onDismiss={reportMessage ? () => setReportMessage(null) : allocation.clearMessage}
            />

            <section className="filters-card">
                <FilterInput
                    label="Search by name"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search applicants"
                />
                <FilterSelect
                    label="Branch"
                    value={branch}
                    onChange={setBranch}
                    options={branches}
                />
                <FilterSelect
                    label="Category"
                    value={category}
                    onChange={setCategory}
                    options={categories}
                />
            </section>

            <ApplicantsTable
                applicants={applicants}
                selectionReady={allocation.selectionReady}
                selectedYear={allocation.selection.year}
                loading={allocation.loading}
            />

            <AllocationResultsTable results={allocation.allocationResults} />
        </AdminShell>
    );
}

function getUniqueValues(applicants, property) {
    return [...new Set(applicants.map((student) => student[property]).filter(Boolean))].sort();
}

function filterApplicants(applicants, search, branch, category) {
    const normalizedSearch = search.toLowerCase();

    return applicants.filter((student) => (
        (!normalizedSearch || student.name?.toLowerCase().includes(normalizedSearch))
        && (!branch || student.branch === branch)
        && (!category || student.category === category)
    ));
}

function Summary({ label, value }) {
    return (
        <article>
            <span>{label}</span>
            <strong>{value}</strong>
        </article>
    );
}

function FilterInput({ label, onChange, placeholder, value }) {
    return (
        <label>
            {label}
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
            />
        </label>
    );
}

function FilterSelect({ label, onChange, options, value }) {
    return (
        <label>
            {label}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                <option value="">
                    All {label.toLowerCase()}
                </option>
                {options.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </label>
    );
}
