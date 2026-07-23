/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";

const AllocationContext = createContext(null);
export const courses = ["B.tech", "M.tech", "MCA", "Diploma"];
export const courseYears = { "B.tech": ["First Year", "Second Year", "Third Year", "Final Year"], "M.tech": ["First Year", "Second Year"], MCA: ["First Year", "Second Year"], Diploma: ["First Year", "Second Year", "Final Year"] };
const currentYear = new Date().getFullYear();
export const academicYears = Array.from({ length: 6 }, (_, index) => `${currentYear - index}-${currentYear - index + 1}`);

export function AllocationProvider({ children }) {
  const [selection, setSelection] = useState({ academicYear: academicYears[0], course: "", year: "" });
  const [applicants, setApplicants] = useState([]);
  const [seatRows, setSeatRows] = useState([]);
  const [allocationResults, setAllocationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  const [isApplicationLive, setIsApplicationLive] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [allocationsExist, setAllocationExist] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const requestId = useRef(0);
  const statusRequestId = useRef(0);
  const selectionReady = Boolean(selection.academicYear && selection.course && selection.year);
  const query = useMemo(() => ({ academicYear: selection.academicYear, course: selection.course, year: selection.year }), [selection]);

  const loadAllocationGroup = useCallback(async () => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setLoading(true);
    setAllocationResults([]);
    try {
      const [applicantResponse, seatMatrixResponse, allocationResponse] = await Promise.all([
        api.get("/admin/applicants", { params: query }),
        api.get("/seat-matrix", { params: query }),
        api.get("/allocation", { params: query }),
      ]);
      if (requestId.current !== currentRequest) return;
      setApplicants(Array.isArray(applicantResponse.data) ? applicantResponse.data : []);
      setSeatRows(Array.isArray(seatMatrixResponse.data) ? seatMatrixResponse.data : []);
      setAllocationResults(Array.isArray(allocationResponse.data?.data) ? allocationResponse.data.data : []);
      setAllocationExist(Boolean(allocationResponse.data?.exists));
    } catch (error) {
      if (requestId.current !== currentRequest) return;
      setApplicants([]); setSeatRows([]); setAllocationResults([]); setAllocationExist(false);
      setMessage({ type: "error", text: error.response?.data?.message || "Could not load this allocation group." });
    } finally { if (requestId.current === currentRequest) setLoading(false); }
  }, [query]);

  const loadApplicationStatus = useCallback(async () => {
    if (!selectionReady) return;
    const currentRequest = statusRequestId.current + 1;
    statusRequestId.current = currentRequest;
    setIsStatusLoading(true);
    try {
      const response = await api.get("/form-status", { params: query });
      if (statusRequestId.current === currentRequest) setIsApplicationLive(Boolean(response.data?.isLive));
    } catch {
      if (statusRequestId.current === currentRequest) {
        setIsApplicationLive(false);
        setMessage({ type: "error", text: "Unable to load application status." });
      }
    } finally { if (statusRequestId.current === currentRequest) setIsStatusLoading(false); }
  }, [query, selectionReady]);

  useEffect(() => {
    if (!selectionReady) return undefined;
    const timer = window.setTimeout(() => {
      void loadAllocationGroup();
      void loadApplicationStatus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAllocationGroup, loadApplicationStatus, selectionReady]);

  const updateSelection = (field, value) => {
    setMessage(null); setAllocationResults([]); setAllocationExist(false);
    const nextSelection = { ...selection, [field]: value, ...(field === "course" ? { year: "" } : {}) };
    statusRequestId.current += 1;
    setIsApplicationLive(false);
    if (!nextSelection.academicYear || !nextSelection.course || !nextSelection.year) {
      requestId.current += 1; setApplicants([]); setSeatRows([]); setAllocationExist(false); setLoading(false); setIsStatusLoading(false);
    }
    setSelection(nextSelection);
  };

  const toggleApplicationStatus = async () => {
    if (!selectionReady || isUpdatingStatus) return;
    const nextStatus = !isApplicationLive;
    setIsUpdatingStatus(true); setMessage(null);
    try {
      const response = await api.put("/form-status", { ...selection, isLive: nextStatus });
      setIsApplicationLive(nextStatus);
      setSuccessMessage({ title: "Application status updated", description: response.data?.message || "Application status updated successfully." });
    } catch { setMessage({ type: "error", text: "Unable to update application status." }); }
    finally { setIsUpdatingStatus(false); }
  };

 const startAllocation = async () => {
  setIsAllocating(true);
  setMessage(null);

  try {
    const response = await api.post("/allocation", selection);

    const results = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    setAllocationResults(results);

    // Allocation now exists
    setAllocationExist(true);

    setSuccessMessage({
      title: "Allocation completed",
      description: `${
        response.data?.message || "Allocation completed."
      } ${results.filter((student) => student.allocated).length} students were allotted a seat.`,
    });
  } catch (error) {
    setMessage({
      type: "error",
      text:
        error.response?.data?.message ||
        "Allocation could not be completed.",
    });
  } finally {
    setIsAllocating(false);
  }
};
   const resetAllocation = async () => {
    if (!selectionReady || isResetting) return;

  setIsResetting(true);
  setMessage(null);

 
  try {
    const response = await api.post("/allocation/reset", selection);

    setAllocationResults([]);
    setApplicants([]);
    setAllocationExist(false);

    setSuccessMessage({
      title: "Allocation Reset",
      description:
        response.data?.message || "Allocation reset successfully.",
    });

    await loadAllocationGroup();

    return true;
  } catch (error) {
    setMessage({
      type: "error",
      text:
        error.response?.data?.message ||
        "Failed to reset allocation.",
    });

    return false;
  } finally {
    setIsResetting(false);
  }
};

  const branchCount = new Set(applicants.map((applicant) => applicant.branch).filter(Boolean)).size;
  const availableSeats = seatRows.reduce((sum, row) => {
    if (row.total_seats !== undefined && row.total_seats !== null && row.total_seats !== "") return sum + (Number(row.total_seats) || 0);
    return sum + ((Number(row.per_branch_seats) || 0) * (Number(row.number_of_branches ?? row.branch_count ?? branchCount) || 0)) + (Number(row.extra_seats) || 0);
  }, 0);

 const value = {
  selection,
  applicants,
  seatRows,
  allocationResults,
  loading,
  isAllocating,
  isResetting,
  allocationsExist,
  isApplicationLive,
  isStatusLoading,
  isUpdatingStatus,
  message,
  successMessage,
  selectionReady,
  availableSeats,

  updateSelection,
  toggleApplicationStatus,
  startAllocation,
  resetAllocation,

  clearMessage: () => setMessage(null),
  clearSuccessMessage: () => setSuccessMessage(null),
};

return (
  <AllocationContext.Provider value={value}>
    {children}
  </AllocationContext.Provider>
);
}

export function useAllocation() {
  const context = useContext(AllocationContext);

  if (!context) {
    throw new Error(
      "useAllocation must be used within AllocationProvider"
    );
  }

  return context;
}
