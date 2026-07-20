import { supabase } from "../utils/supabase.js";
import { seatMatrix } from "../data/seatMatrix.js";

const supportedPoolCategories = {
  3: "SC",
  4: "ST",
  5: "VJDTNT",
  6: "SEBC",
  7: "EWS",
};

const categoryLabels = {
  1: "Open",
  2: "OBC",
  3: "SC",
  4: "ST",
  5: "VJDTNT",
  6: "SEBC",
  7: "EWS",
};

const getFreshSeatMatrix = () => JSON.parse(JSON.stringify(seatMatrix));

export const getAllocationSummary = async () => {
  const { count, error } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true });

  if (error) throw error;

  const courseSeats = Object.values(seatMatrix["B.tech"]).reduce(
    (total, branch) => total + branch[1].seats + branch[2].seats,
    0
  );
  const poolSeats = ["SC", "ST", "VJDTNT", "SEBC", "EWS"].reduce(
    (total, category) => total + seatMatrix.pools[category].total,
    0
  );

  return {
    totalApplications: count || 0,
    availableSeats: courseSeats + poolSeats,
  };
};

export const runAllocationAlgorithm = async () => {
  const [
    { data: students, error: studentsError },
    { data: branches, error: branchesError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase.from("students").select("*"),
    supabase.from("branches").select("id, branch_name"),
    supabase.from("categories").select("id, category_name"),
  ]);

  if (studentsError) throw studentsError;
  if (branchesError) throw branchesError;
  if (categoriesError) throw categoriesError;

  const matrix = getFreshSeatMatrix();
  const allocations = [];
  const allocationByStudentId = new Map();
  const branchStudentsById = new Map();

  for (let branchId = 1; branchId <= 9; branchId += 1) {
    branchStudentsById.set(
      branchId,
      students
        .filter((student) => student.course === "B.tech" && student.branch_id === branchId)
        .sort(
          (first, second) =>
            Number(second.cgpa || 0) - Number(first.cgpa || 0) ||
            String(first.id).localeCompare(String(second.id))
        )
    );
  }

  const addAllocation = (student, categoryId) => {
    if (allocationByStudentId.has(student.id)) return;

    allocations.push({
      application_id: student.id,
      branch_id: student.branch_id,
      category_id: categoryId,
    });
    allocationByStudentId.set(student.id, categoryId);
  };

  // Phase 1: allocate each branch's Open seats purely by merit, regardless of category.
  for (let branchId = 1; branchId <= 9; branchId += 1) {
    const branchStudents = branchStudentsById.get(branchId);
    let remainingOpenSeats = matrix["B.tech"][branchId][1].seats;

    for (const student of branchStudents) {
      if (remainingOpenSeats === 0) break;
      addAllocation(student, 1);
      remainingOpenSeats -= 1;
    }
  }

  // Phase 2: allocate remaining students through their reserved category seats.
  for (let branchId = 1; branchId <= 9; branchId += 1) {
    const branchStudents = branchStudentsById.get(branchId);
    let remainingObcSeats = matrix["B.tech"][branchId][2].seats;

    for (const student of branchStudents) {
      if (remainingObcSeats === 0) break;
      if (student.category_id !== 2 || allocationByStudentId.has(student.id)) continue;
      addAllocation(student, 2);
      remainingObcSeats -= 1;
    }

    for (const [categoryId, poolName] of Object.entries(supportedPoolCategories)) {
      const pool = matrix.pools[poolName];
      let allocatedInBranch = 0;
      for (const student of branchStudents) {
        if (pool.remaining === 0 || allocatedInBranch === pool.maxPerBranch) break;
        if (student.category_id !== Number(categoryId) || allocationByStudentId.has(student.id)) continue;
        addAllocation(student, Number(categoryId));
        pool.remaining -= 1;
        allocatedInBranch += 1;
      }
    }
  }

  const branchNames = new Map((branches || []).map((branch) => [branch.id, branch.branch_name]));
  const categoryNames = new Map((categories || []).map((category) => [category.id, category.category_name]));
  const results = [...students]
    .sort((first, second) => Number(second.cgpa || 0) - Number(first.cgpa || 0))
    .map((student) => {
      const allocatedCategoryId = allocationByStudentId.get(student.id);

      return {
        id: student.id,
        name: student.name || "—",
        branch: branchNames.get(student.branch_id) || `Branch ${student.branch_id || "—"}`,
        cgpa: student.cgpa ?? "—",
        nativePlace: student.Native_Place || student.native_place || "—",
        studentCategory: categoryNames.get(student.category_id) || categoryLabels[student.category_id] || "—",
        allocated: allocatedCategoryId !== undefined,
        allocatedCategory: allocatedCategoryId !== undefined
          ? categoryNames.get(allocatedCategoryId) || categoryLabels[allocatedCategoryId] || `Category ${allocatedCategoryId}`
          : "—",
      };
    });

  return { allocations, results };
};
