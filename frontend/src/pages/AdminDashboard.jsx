import { useState } from "react";
import { Link } from "react-router-dom";
import AcademicGroupFields from "../components/AcademicGroupFields";
import AdminShell from "../components/AdminShell";
import { ConfirmationDialog, SuccessDialog } from "../components/popups";
import ResultBanner from "../components/ResultBanner";
import { useAllocation } from "../context/AllocationContext";
import "../styles/AdminDashboard.css";
import "../styles/ApplicationsPage.css";

export default function AdminDashboard() {
  const allocation = useAllocation();

  const [showAllocationConfirmation, setShowAllocationConfirmation] =
    useState(false);
  const [showStatusConfirmation, setShowStatusConfirmation] =
    useState(false);

  const [showResetConfirmation, setShowResetConfirmation] =
  useState(false);

  const allocatedCount = allocation.allocationResults.filter(
    (student) => student.allocated
  ).length;

  return (
    <>
      <AdminShell
        activePage="dashboard"
        applicantCount={allocation.applicants.length}
        breadcrumb={
          <>
            Administration <span>/</span> Overview
          </>
        }
      >
        <div className="page-heading">
          <div>
            <p className="eyebrow">HOSTEL ALLOCATION</p>
            <h1>Allocation control centre</h1>
            <p>
              Choose an academic group to manage its application window and
              allocation.
            </p>
          </div>
        </div>

        <section className="selection-card">
          <AcademicGroupFields
            selection={allocation.selection}
            updateSelection={allocation.updateSelection}
          />
        </section>

        <section className="selection-card" aria-live="polite">
          <ApplicationStatus
            allocation={allocation}
            onConfirm={() => setShowStatusConfirmation(true)}
          />
        </section>

        <ResultBanner
          message={allocation.message}
          onDismiss={allocation.clearMessage}
        />

        <section className="stat-grid" aria-label="Allocation summary">
          <Stat
            label="Applied applicants"
            value={allocation.loading ? "…" : allocation.applicants.length}
            detail="For the selected group"
          />

          <Stat
            label="Configured seats"
            value={allocation.availableSeats}
            detail="From the current seat matrix"
          />

          <Stat
            label="Allocated students"
            value={allocatedCount}
            detail="From this allocation run"
          />

          <Stat
            label="Not allocated"
            value={allocation.allocationResults.length - allocatedCount}
            detail="From this allocation run"
          />
        </section>

        <section className="allocation-card">
          <div className="allocation-copy">
            <p className="eyebrow">ALLOCATION</p>

            <h2>Run seat allocation</h2>

            <p>
              Processes the selected group using its saved seat matrix, branch
              and category rules.
            </p>

            <div className="ready-row">
              {allocation.selectionReady
                ? `${allocation.applicants.length} applications ready for allocation`
                : "Select the academic details first"}
            </div>
          </div>

          {allocation.allocationsExist ? (
  <button
    className="start-button"
    disabled={allocation.isResetting}
    onClick={() => setShowResetConfirmation(true)}
  >
    <span>
      {allocation.isResetting
        ? "Resetting..."
        : "Reset Allocation"}
    </span>
    <b>↺</b>
  </button>
) : (
  <button
    className="start-button"
    disabled={
      !allocation.selectionReady ||
      !allocation.applicants.length ||
      !allocation.availableSeats ||
      allocation.isAllocating
    }
    onClick={() => setShowAllocationConfirmation(true)}
  >
    <span>
      {allocation.isAllocating
        ? "Processing..."
        : "Start Allocation"}
    </span>
    <b>→</b>
  </button>
)}
</section>
        <Link className="applications-link-card" to="/admin/applications">
          <div>
            <p className="eyebrow">APPLICATIONS</p>

            <h2>Manage applications and results</h2>

            <p>
              Review applicants, search and filter records, and view allocation
              outcomes.
            </p>
          </div>

          <span>View applications →</span>
        </Link>
      </AdminShell>

      <ConfirmationDialog
        open={showAllocationConfirmation}
        title="Start hostel allocation?"
        description={
          <>
            Academic Year: {allocation.selection.academicYear}
            <br />
            Course: {allocation.selection.course}
            <br />
            Year: {allocation.selection.year}
            <br />
            Number of Applicants: {allocation.applicants.length}
            <br />
            Available Seats: {allocation.availableSeats}
          </>
        }
        confirmText="Start allocation"
        variant="warning"
        loading={allocation.isAllocating}
        onConfirm={async () => {
          await allocation.startAllocation();
          setShowAllocationConfirmation(false);
        }}
        onCancel={() => setShowAllocationConfirmation(false)}
      />

      <ConfirmationDialog
        open={showStatusConfirmation}
        title={`${
          allocation.isApplicationLive ? "Close" : "Open"
        } applications?`}
        description={`This will ${
          allocation.isApplicationLive ? "stop" : "allow"
        } application submissions for the selected academic group.`}
        confirmText={
          allocation.isApplicationLive
            ? "Close applications"
            : "Open applications"
        }
        variant={allocation.isApplicationLive ? "danger" : "primary"}
        loading={allocation.isUpdatingStatus}
        onConfirm={async () => {
          await allocation.toggleApplicationStatus();
          setShowStatusConfirmation(false);
        }}
        onCancel={() => setShowStatusConfirmation(false)}
        />

        <ConfirmationDialog
  open={showResetConfirmation}
  title="Reset hostel allocation?"
  description={
    <>
      This will remove all allocations for:
      <br />
      Academic Year: {allocation.selection.academicYear}
      <br />
      Course: {allocation.selection.course}
      <br />
      Year: {allocation.selection.year}
    </>
  }
  confirmText="Reset Allocation"
  variant="danger"
  loading={allocation.isResetting}
  onConfirm={async () => {
    await allocation.resetAllocation();
    setShowResetConfirmation(false);
  }}
  onCancel={() => setShowResetConfirmation(false)}
/>

      <SuccessDialog
        open={Boolean(allocation.successMessage)}
        title={allocation.successMessage?.title}
        description={allocation.successMessage?.description}
        onClose={allocation.clearSuccessMessage}
      />
    </>
  );
}

function ApplicationStatus({ allocation, onConfirm }) {
  return (
    <>
      <div className="section-title">
        <div>
          <p className="eyebrow">APPLICATION STATUS</p>
          <h2>Application Window</h2>
        </div>
      </div>

      <div className="ready-row">
        <span>Current status</span>

        <span
          className={`allocation-status ${
            allocation.isApplicationLive ? "allotted" : "not-allotted"
          }`}
        >
          {allocation.isStatusLoading
            ? "Loading..."
            : allocation.isApplicationLive
            ? "Applications Open"
            : "Applications Closed"}
        </span>
      </div>

      <div className="ready-row">
        <span>
          Last action: {allocation.isApplicationLive ? "Open" : "Closed"}
        </span>

        <button
          className="confirm-button"
          type="button"
          disabled={
            !allocation.selectionReady ||
            allocation.isStatusLoading ||
            allocation.isUpdatingStatus
          }
          onClick={onConfirm}
          style={
            allocation.isApplicationLive
              ? {
                  background: "#EF4444",
                  borderColor: "#EF4444",
                  color: "#FFFFFF",
                }
              : undefined
          }
        >
          {allocation.isUpdatingStatus
            ? "Updating..."
            : allocation.isApplicationLive
            ? "Close Applications"
            : "Open Applications"}
        </button>
      </div>
    </>
  );
}

function Stat({ label, value, detail }) {
  return (
    <article className="stat-card">
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}