export const buildAllocationResults = (allocations, students, branches, categories, year) => {
  const allocationMap = new Map(allocations.map((item) => [item.student_id, item]));
  const branchMap = new Map(branches.map((item) => [item.id, item.branch_name]));
  const categoryMap = new Map(categories.map((item) => [item.id, item.category_name]));

  return students.map((student) => {
    const allocation = allocationMap.get(student.id);
    return {
      id: student.id,
      name: student.name,
      branch: branchMap.get(student.branch_id) || "—",
      cgpa: year === "First Year" ? (student.rank ?? "—") : (student.cgpa ?? "—"),
      nativePlace: student.native_place || "—",
      studentCategory: categoryMap.get(student.category_id) || "—",
      allocatedCategory: allocation ? categoryMap.get(allocation.category_id) || "Open" : "—",
      allocated: Boolean(allocation),
    };
  });
};
