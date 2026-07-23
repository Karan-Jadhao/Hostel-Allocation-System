import { academicYears, courses, courseYears } from "../context/AllocationContext";

export default function AcademicGroupFields({ selection, updateSelection }) {
  return(
  <>
    <div className="section-title">
        <div>
            <p className="eyebrow">ALLOCATION GROUP</p>
            <h2>Academic details</h2>
        </div>
    </div>

    <div className="selection-grid">
        <label>
            Academic Year
            <select
                value={selection.academicYear}
                onChange={(event) =>
                    updateSelection("academicYear", event.target.value)
                }
            >
                {academicYears.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </label>

        <label>
            Course
            <select
                value={selection.course}
                onChange={(event) =>
                    updateSelection("course", event.target.value)
                }
            >
                <option value="">Select course</option>

                {courses.map((course) => (
                    <option key={course} value={course}>
                        {course}
                    </option>
                ))}
            </select>
        </label>

        <label>
            Year of Study
            <select
                value={selection.year}
                disabled={!selection.course}
                onChange={(event) =>
                    updateSelection("year", event.target.value)
                }
            >
                <option value="">Select year</option>

                {(courseYears[selection.course] || []).map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </label>
    </div>
</>
  )
}
