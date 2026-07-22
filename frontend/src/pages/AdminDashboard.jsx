import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/AdminDashboard.css";

const courses = ["B.tech", "M.tech", "MCA", "Diploma"];
const courseYears = {
  "B.tech": ["First Year", "Second Year", "Third Year", "Final Year"],
  "M.tech": ["First Year", "Second Year"],
  MCA: ["First Year", "Second Year"],
  Diploma: ["First Year", "Second Year", "Final Year"],
};

const currentYear = new Date().getFullYear();
const academicYears = Array.from(
  { length: 6 },
  (_, index) => `${currentYear - index}-${currentYear - index + 1}`,
);

function AdminDashboard() {
  const [selection, setSelection] = useState({
    academicYear: academicYears[0],
    course: "",
    year: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [seatRows, setSeatRows] = useState([]);
  const [allocationResults, setAllocationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  const [isApplicationLive, setIsApplicationLive] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState(null);
  const requestId = useRef(0);
  const statusRequestId = useRef(0);

  const selectionReady = Boolean(
    selection.academicYear && selection.course && selection.year,
  );
  const query = useMemo(
    () => ({
      academicYear: selection.academicYear,
      course: selection.course,
      year: selection.year,
    }),
    [selection.academicYear, selection.course, selection.year],
  );

  const loadDashboard = useCallback(async () => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setLoading(true);
    setAllocationResults([]);

    try {
      const applicantResponse = await api.get("/admin/applicants", { params: query });
      const seatMatrixResponse = await api.get("/seat-matrix", { params: query });

      if (requestId.current !== currentRequest) return;

      setApplicants(Array.isArray(applicantResponse.data) ? applicantResponse.data : []);
      setSeatRows(Array.isArray(seatMatrixResponse.data) ? seatMatrixResponse.data : []);
    } catch (error) {
      if (requestId.current !== currentRequest) return;

      setApplicants([]);
      setSeatRows([]);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Could not load this allocation group.",
      });
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false);
      }
    }
  }, [query]);

  const loadApplicationStatus = useCallback(async () => {
    if (!selectionReady) return;

    const currentRequest = statusRequestId.current + 1;
    statusRequestId.current = currentRequest;
    setIsStatusLoading(true);

    try {
      const response = await api.get("/form-status", { params: query });

      if (statusRequestId.current !== currentRequest) return;

      setIsApplicationLive(Boolean(response.data?.isLive));
    } catch (error) {
      console.error(error);
      if (statusRequestId.current !== currentRequest) return;

      setIsApplicationLive(false);
      setMessage({
        type: "error",
        text: "Unable to load application status.",
      });
    } finally {
      if (statusRequestId.current === currentRequest) {
        setIsStatusLoading(false);
      }
    }
  }, [query, selectionReady]);

  useEffect(() => {
    if (!selectionReady) return;

    const loadTimer = window.setTimeout(() => {
      void loadDashboard();
      void loadApplicationStatus();
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [loadApplicationStatus, loadDashboard, selectionReady]);

  const updateSelection = (field, value) => {
    setMessage(null);
    setShowConfirmation(false);
    setAllocationResults([]);
    const nextSelection = {
      ...selection,
      [field]: value,
      ...(field === "course" ? { year: "" } : {}),
    };

    statusRequestId.current += 1;
    setIsApplicationLive(false);
    setIsStatusLoading(Boolean(
      nextSelection.academicYear && nextSelection.course && nextSelection.year,
    ));

    if (!nextSelection.academicYear || !nextSelection.course || !nextSelection.year) {
      requestId.current += 1;
      setApplicants([]);
      setSeatRows([]);
      setLoading(false);
      setIsStatusLoading(false);
    }

    setSelection(nextSelection);
  };

  const toggleApplicationStatus = async () => {
    if (!selectionReady || isUpdatingStatus) return;

    const nextStatus = !isApplicationLive;

    statusRequestId.current += 1;
    setIsUpdatingStatus(true);
    setMessage(null);

    try {
      const response = await api.put("/form-status", {
        ...selection,
        isLive: nextStatus,
      });

      setIsApplicationLive(nextStatus);
      setMessage({
        type: "success",
        text: response.data?.message || "Application status updated successfully.",
      });
    } catch (error) {
      console.error(error)
      setMessage({
        type: "error",
        text: "Unable to update application status.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const startAllocation = async () => {
    setIsAllocating(true);
    setMessage(null);
    setShowConfirmation(false);

    try {
      const response = await api.post("/allocation", selection);
      const results = Array.isArray(response.data?.data) ? response.data.data : [];

      setAllocationResults(results);
      setMessage({
        type: "success",
        text: response.data?.message || "Allocation completed.",
        detail: `${results.filter((student) => student.allocated).length} students were allotted a seat.`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Allocation could not be completed.",
      });
    } finally {
      setIsAllocating(false);
    }
  };

  const branchCount = new Set(
    applicants.map((applicant) => applicant.branch).filter(Boolean),
  ).size;

  const availableSeats = seatRows.reduce((sum, row) => {
    const hasTotalSeats = row.total_seats !== undefined
      && row.total_seats !== null
      && row.total_seats !== "";

    if (hasTotalSeats) return sum + (Number(row.total_seats) || 0);

    const numberOfBranches = Number(
      row.number_of_branches ?? row.branch_count ?? branchCount,
    ) || 0;
    const perBranchSeats = Number(row.per_branch_seats) || 0;
    const extraSeats = Number(row.extra_seats) || 0;

    return sum + (perBranchSeats * numberOfBranches) + extraSeats;
  }, 0);

  const canStartAllocation = selectionReady
    && applicants.length > 0
    && seatRows.length > 0
    && !isAllocating;

  return <main className="admin-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">H</span><span>Hostel<span className="brand-accent">Flow</span></span></div>
      <nav className="main-nav"><a className="nav-link active" href="#dashboard">Overview</a><Link className="nav-link" to="/seat-matrix">Seat Matrix</Link><a className="nav-link" href="#applications">Applications <b>{applicants.length}</b></a><a className="nav-link" href="#allocation">Allocation</a></nav>
      <div className="sidebar-bottom"><div className="admin-profile"><div className="avatar">AR</div><div><strong>Admin</strong><small>Administrator</small></div></div></div>
    </aside>
    <section className="dashboard" id="dashboard"><header className="topbar"><div className="crumb">Administration <span>/</span> Overview</div></header>
      <div className="content"><div className="page-heading"><div><p className="eyebrow">HOSTEL ALLOCATION</p><h1>Allocation control centre</h1><p>Choose an academic group to manage its application window and allocation.</p></div></div>
        <section className="selection-card"><div className="section-title"><div><p className="eyebrow">ALLOCATION GROUP</p><h2>Academic details</h2></div></div>
          <div className="selection-grid"><label>Academic year<select value={selection.academicYear} onChange={(event) => updateSelection("academicYear", event.target.value)}>{academicYears.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>Course<select value={selection.course} onChange={(event) => updateSelection("course", event.target.value)}><option value="">Select course</option>{courses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>Year of study<select value={selection.year} onChange={(event) => updateSelection("year", event.target.value)} disabled={!selection.course}><option value="">Select year</option>{(courseYears[selection.course] || []).map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>
        </section>
        <section className="selection-card" aria-live="polite">
          <div className="section-title">
            <div>
              <p className="eyebrow">APPLICATION STATUS</p>
              <h2>Application Window</h2>
            </div>
          </div>
          <div className="ready-row">
            <span>Current status</span>
            <span className={`allocation-status ${isApplicationLive ? "allotted" : "not-allotted"}`}>
              {isStatusLoading ? "Loading..." : isApplicationLive ? "🟢 Applications Open" : "🔴 Applications Closed"}
            </span>
          </div>
          <div className="ready-row">
            <span>Last action: {isApplicationLive ? "Open" : "Closed"}</span>
            <button
              className="confirm-button"
              type="button"
              disabled={!selectionReady || isStatusLoading || isUpdatingStatus}
              onClick={toggleApplicationStatus}
              style={isApplicationLive ? { background: "#EF4444", borderColor: "#EF4444", color: "#FFFFFF" } : undefined}
            >
              {isUpdatingStatus ? "Updating..." : isApplicationLive ? "Close Applications" : "Open Applications"}
            </button>
          </div>
        </section>
        {message && <div className={`result-banner ${message.type}`} role="status"><span>{message.type === "success" ? "✓" : "!"}</span><div><strong>{message.text}</strong>{message.detail && <small>{message.detail}</small>}</div><button onClick={() => setMessage(null)} aria-label="Dismiss">×</button></div>}
        <section className="stat-grid" aria-label="Allocation summary"><article className="stat-card"><div><p>Applied applicants</p><strong>{loading ? "…" : applicants.length}</strong><small>For the selected group</small></div></article><article className="stat-card"><div><p>Configured seats</p><strong>{availableSeats}</strong><small>From the current seat matrix</small></div></article><article className="stat-card"><div><p>Allocated students</p><strong>{allocationResults.filter((student) => student.allocated).length}</strong><small>From this allocation run</small></div></article><article className="stat-card"><div><p>Not allocated</p><strong>{allocationResults.filter((student) => !student.allocated).length}</strong><small>From this allocation run</small></div></article></section>
        <section className="allocation-card" id="allocation"><div className="allocation-copy"><p className="eyebrow">ALLOCATION</p><h2>Run seat allocation</h2><p>Processes the selected group using its saved seat matrix, branch and category rules.</p><div className="ready-row">{selectionReady ? `${applicants.length} applications ready for allocation` : "Select the academic details first"}</div></div><button className="start-button" disabled={!canStartAllocation} onClick={() => setShowConfirmation(true)}><span>{isAllocating ? "Processing..." : "Start allocation"}</span><b>→</b></button></section>
        <section className="results-card" id="applications"><div className="section-title"><div><p className="eyebrow">APPLIED APPLICANTS</p><h2>Applicant information</h2><p className="results-subtitle">Applications submitted for the selected academic group.</p></div><span className="results-count">{applicants.length} applicants</span></div><div className="table-scroll"><table><thead><tr><th>Name</th><th>Application / Roll no.</th><th>Branch</th><th>Year</th><th>Category</th><th>{selection.year === "First Year" ? "Rank" : "CGPA"}</th><th>Contact</th></tr></thead><tbody>{applicants.length ? applicants.map((student) => <tr key={student.id}><td className="student-name">{student.name}</td><td>{student.applicationNo}</td><td>{student.branch}</td><td>{student.year}</td><td>{student.category}</td><td>{student.merit ?? "—"}</td><td>{student.email || student.phone || "—"}</td></tr>) : <tr><td colSpan="7" className="empty-results">{selectionReady ? "No applications have been submitted for this group." : "Select academic details to see applicants."}</td></tr>}</tbody></table></div></section>
        {allocationResults.length > 0 && <section className="results-card"><div className="section-title"><div><p className="eyebrow">ALLOCATION RESULTS</p><h2>Allocation result</h2></div><span className="results-count">{allocationResults.length} students</span></div><div className="table-scroll"><table><thead><tr><th>Name</th><th>Branch</th><th>Merit</th><th>Student category</th><th>Allotted through</th><th>Status</th></tr></thead><tbody>{allocationResults.map((student) => <tr key={student.id}><td className="student-name">{student.name}</td><td>{student.branch}</td><td>{student.merit ?? "—"}</td><td>{student.studentCategory}</td><td>{student.allocatedCategory}</td><td><span className={`allocation-status ${student.allocated ? "allotted" : "not-allotted"}`}>{student.allocated ? "Allotted" : "Not allotted"}</span></td></tr>)}</tbody></table></div></section>}
      </div>
    </section>
    {showConfirmation && <div className="modal-backdrop"><div className="confirm-modal" role="dialog" aria-modal="true"><div className="modal-icon">!</div><h2>Start hostel allocation?</h2><p>Academic Year: {selection.academicYear}<br />Course: {selection.course}<br />Year: {selection.year}<br />Number of Applicants: {applicants.length}<br />Available Seats: {availableSeats}</p><div className="modal-actions"><button className="cancel-button" onClick={() => setShowConfirmation(false)}>Cancel</button><button className="confirm-button" onClick={startAllocation}>Yes, start allocation</button></div></div></div>}
  </main>;
}

export default AdminDashboard;
