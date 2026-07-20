import { useEffect, useState } from "react";
import api from "../api/axios";
import "./AdminDashboard.css";

const allocationSteps = [
  ["01", "Lock applications", "Application period closes before allocation runs."],
  ["02", "Run allocation", "Seats are assigned by merit, category and branch rules."],
  ["03", "Publish results", "Review the list and notify successful applicants."],
];

const activity = [
  ["Application window", "Closes today at 6:00 PM", "warning"],
  ["Seat matrix", "108 seats configured", "success"],
  ["Last allocation", "No allocation has been run yet", "neutral"],
];

function AdminDashboard() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState({ totalApplications: 0, availableSeats: 0 });
  const [allocationResults, setAllocationResults] = useState([]);
  const [hasAllocationRun, setHasAllocationRun] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await api.get("/allocation/summary");
        setSummary(response.data.data);
      } catch (error) {
        console.error("Unable to load allocation dashboard summary:", error);
      }
    };

    loadSummary();
  }, []);

  const startAllocation = async () => {
    setIsAllocating(true);
    setResult(null);

    try {
      const response = await api.post("/allocation");
      const studentResults = Array.isArray(response.data.data) ? response.data.data : [];
      setAllocationResults(studentResults);
      setHasAllocationRun(true);
      setResult({
        type: "success",
        message: response.data.message || "Allocation completed successfully.",
        allocated: response.data.totalAllocated,
      });
      setSummary((currentSummary) => ({ ...currentSummary, totalApplications: studentResults.length }));
      window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      setResult({
        type: "error",
        message: error.response?.data?.message || "Allocation could not be started. Please try again.",
      });
    } finally {
      setIsAllocating(false);
      setShowConfirmation(false);
    }
  };

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">H</span><span>Hostel<span className="brand-accent">Flow</span></span></div>
        <nav className="main-nav" aria-label="Admin navigation">
          <a className="nav-link active" href="#dashboard"><span>▦</span> Overview</a>
          <a className="nav-link" href="#applications"><span>◫</span> Applications <b>248</b></a>
          <a className="nav-link" href="#allocation"><span>◌</span> Allocation</a>
          <a className="nav-link" href="#students"><span>♙</span> Students</a>
          <a className="nav-link" href="#reports"><span>▤</span> Reports</a>
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings"><span>⚙</span> Settings</a>
          <div className="admin-profile"><div className="avatar">AR</div><div><strong>Admin Raut</strong><small>Administrator</small></div><span className="more">•••</span></div>
        </div>
      </aside>

      <section className="dashboard" id="dashboard">
        <header className="topbar">
          <div className="crumb">Administration <span>/</span> Overview</div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><button className="help-button">? <span>Help center</span></button></div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div><p className="eyebrow">ACADEMIC YEAR 2026–27</p><h1>Good morning, Admin.</h1><p>Here’s what’s happening with this year’s hostel allocation.</p></div>
            <button className="outline-button">⌄&nbsp; 2026–27</button>
          </div>

          <section className="stat-grid" aria-label="Allocation summary">
            <article className="stat-card"><div className="stat-icon blue">◫</div><div><p>Total applications</p><strong>{summary.totalApplications}</strong><small>Loaded from the application database</small></div></article>
            <article className="stat-card"><div className="stat-icon violet">▦</div><div><p>Available seats</p><strong>{summary.availableSeats}</strong><small>Configured in the seat matrix</small></div></article>
            <article className="stat-card"><div className="stat-icon orange">◷</div><div><p>Not allocated</p><strong>{allocationResults.filter((student) => !student.allocated).length}</strong><small className="attention">Shown after allocation runs</small></div></article>
            <article className="stat-card"><div className="stat-icon green">✓</div><div><p>Allocated students</p><strong>{allocationResults.filter((student) => student.allocated).length}</strong><small className="up">Results from the latest run</small></div></article>
          </section>

          <section className="allocation-card" id="allocation">
            <div className="allocation-visual"><div className="rings"><span /><span /><span /></div><div className="allocation-glyph">⌂</div></div>
            <div className="allocation-copy"><p className="eyebrow">ALLOCATION CONTROL CENTER</p><h2>Ready to start allocation?</h2><p>All submitted applications will be processed using the current seat matrix and allocation rules.</p><div className="ready-row"><span className="ready-dot">✓</span> {summary.totalApplications} applications are ready for allocation</div></div>
            <button className="start-button" onClick={() => setShowConfirmation(true)} disabled={isAllocating}><span>{isAllocating ? "Processing..." : "Start allocation"}</span><b>→</b></button>
          </section>

          {result && <div className={`result-banner ${result.type}`} role="status"><span>{result.type === "success" ? "✓" : "!"}</span><div><strong>{result.message}</strong>{result.allocated !== undefined && <small>{result.allocated} students allocated in this run.</small>}</div><button aria-label="Dismiss message" onClick={() => setResult(null)}>×</button></div>}

          {hasAllocationRun && <section className="results-card" id="results">
            <div className="section-title">
              <div><p className="eyebrow">ALLOCATION RESULTS</p><h2>Student allocation list</h2><p className="results-subtitle">Results from the latest allocation run.</p></div>
              <span className="results-count">{allocationResults.length} students</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Sr. no.</th><th>Student name</th><th>Branch</th><th>CGPA</th><th>Native place</th><th>Student category</th><th>Allotted through</th><th>Status</th></tr></thead>
                <tbody>{allocationResults.length > 0 ? allocationResults.map((student, index) => <tr key={student.id || index}><td>{index + 1}</td><td className="student-name">{student.name}</td><td>{student.branch}</td><td>{student.cgpa}</td><td>{student.nativePlace}</td><td>{student.studentCategory}</td><td>{student.allocatedCategory}</td><td><span className={`allocation-status ${student.allocated ? "allotted" : "not-allotted"}`}>{student.allocated ? "Allotted" : "Not allotted"}</span></td></tr>) : <tr><td className="empty-results" colSpan="8">No student applications were found for this allocation run.</td></tr>}</tbody>
              </table>
            </div>
          </section>}

          <div className="lower-grid">
            <section className="workflow-card"><div className="section-title"><div><p className="eyebrow">WORKFLOW</p><h2>Allocation process</h2></div><a href="#allocation">View rules →</a></div><div className="steps">{allocationSteps.map(([number, title, description], index) => <div className="step" key={number}><div className={`step-number ${index === 1 ? "current" : ""}`}>{number}</div><div><h3>{title}</h3><p>{description}</p></div>{index === 0 && <span className="step-state">Open</span>}</div>)}</div></section>
            <section className="activity-card"><div className="section-title"><div><p className="eyebrow">SYSTEM STATUS</p><h2>Activity</h2></div></div>{activity.map(([title, description, state]) => <div className="activity" key={title}><span className={`status-dot ${state}`} /><div><h3>{title}</h3><p>{description}</p></div></div>)}<a className="view-all" href="#reports">View activity log →</a></section>
          </div>
        </div>
      </section>

      {showConfirmation && <div className="modal-backdrop" role="presentation"><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div className="modal-icon">!</div><h2 id="confirm-title">Start hostel allocation?</h2><p>This will process all verified applications against the current seat matrix. This action may take a moment.</p><div className="modal-actions"><button className="cancel-button" onClick={() => setShowConfirmation(false)}>Cancel</button><button className="confirm-button" onClick={startAllocation}>Yes, start allocation</button></div></div></div>}
    </main>
  );
}

export default AdminDashboard;
