import { Link } from "react-router-dom";

export default function AdminShell({ activePage, applicantCount, breadcrumb, children }) {
  return <main className="admin-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">H</span><span>Hostel<span className="brand-accent">Flow</span></span></div>
      <nav className="main-nav">
        <Link className={`nav-link ${activePage === "dashboard" ? "active" : ""}`} to="/admin">Overview</Link>
        <Link className="nav-link" to="/seat-matrix">Seat Matrix</Link>
        <Link className={`nav-link ${activePage === "applications" ? "active" : ""}`} to="/admin/applications">Applications <b>{applicantCount}</b></Link>
      </nav>
      <div className="sidebar-bottom"><div className="admin-profile"><div className="avatar">AR</div><div><strong>Admin</strong><small>Administrator</small></div></div></div>
    </aside>
    <section className="dashboard">
      <header className="topbar"><div className="crumb">{breadcrumb}</div></header>
      <div className="content">{children}</div>
    </section>
  </main>;
}
