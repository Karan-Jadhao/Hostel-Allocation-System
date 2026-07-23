import { buildAllocationResults } from "../helper/buildAllocationResults.js";
import { fetchBranches } from "../helper/fetchBranches.js";
import { fetchCategory } from "../helper/fetchCategories.js";
import { getAllocations } from "../helper/getAllocations.js";
import { fetchStudents } from "../helper/fetchStudents.js";

export const getAllocationResults = async (req, res) => {
  try {
    const { academicYear, course, year } = req.query;
    if (!academicYear || !course || !year) {
      return res.status(400).json({
        success: false,
        message: "Academic year, course and year of study are required.",
      });
    }

    const allocations = await getAllocations(academicYear, course, year);
    if (!allocations.length) {
      return res.json({ success: true, exists: false, data: [] });
    }

    const [students, branches, categories] = await Promise.all([
      fetchStudents(academicYear, course, year, { onlyEligible: false }),
      fetchBranches(course),
      fetchCategory(),
    ]);

    return res.json({
      success: true,
      exists: true,
      data: buildAllocationResults(allocations, students, branches, categories, year),
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Could not load saved allocation results.",
    });
  }
};
