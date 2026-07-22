import { getSeatMatrix } from "./seatMatrix.service.js";
import { buildSeatMatrix } from "../helper/buildSeatMatrix.js";
import { fetchCategory } from "../helper/fetchCategories.js";
import { validateSeatMatrix } from "../helper/validateSeatMatrix.js";
import { groupStudentsByBranch } from "../helper/groupStudentsByBranch.js";
import { allocateExtraSeats } from "../helper/allocateExtraSeats.js";
import { allocateReservedSeats } from "../helper/allocateReservedSeats.js";
import { allocateOpenSeats } from "../helper/allocateOpenSeats.js";
import { buildAllocationResults } from "../helper/buildAllocationResults.js";
import { fetchBranches } from "../helper/fetchBranches.js";
import { fetchStudents } from "../helper/fetchStudents.js";
import { sortStudents } from "../helper/sortStudents.js";
import { saveAllocations } from "../helper/saveAllocations.js";
import { updateHostelliteStatus } from "../helper/updateHostelliteStatus.js";

export const allocateHostelSeats = async (academicYear, course, year) => {
  const [seatRows, branches, students, categories] = await Promise.all([
    getSeatMatrix(academicYear, course, year),
    fetchBranches(course),
    fetchStudents(academicYear, course, year),
    fetchCategory(),
  ]);
  const seatMatrix = buildSeatMatrix(seatRows);
  validateSeatMatrix(seatMatrix, branches, students);

  const sortedStudents = sortStudents(students, year);
  const groupedStudents = groupStudentsByBranch(sortedStudents, branches);
  const allocations = [];
  const allocationsMap = new Map();

  allocateOpenSeats(groupedStudents, seatMatrix, branches, allocations, allocationsMap);
  Object.keys(seatMatrix).filter((id) => Number(id) !== 1).forEach((id) =>
    allocateReservedSeats(groupedStudents, seatMatrix, branches, allocations, allocationsMap, Number(id)));
  Object.keys(seatMatrix).filter((id) => Number(id) !== 1).forEach((id) =>
    allocateExtraSeats(sortedStudents, seatMatrix, allocations, allocationsMap, Number(id)));

  if (allocations.length) {
    await saveAllocations(allocations, academicYear, course, year);
    await updateHostelliteStatus(year === "First Year" ? "firstyear_students" : "students", allocations.map((allocation) => allocation.student_id));
  }

  return buildAllocationResults(allocations, students, branches, categories, year);
};
