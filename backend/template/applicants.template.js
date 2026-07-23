import { reportStyles } from "./styles/report.styles.js";
import { tableStyles } from "./styles/table.styles.js";

export function applicantsTemplate(data) {

    const branchMap = new Map(
        data.branches.map(branch => [
            branch.id,
            branch.branch_name,
        ])
    );

    const categoryMap = new Map(
        data.categories.map(category => [
            category.id,
            category.category_name,
        ])
    );

    return `
<!DOCTYPE html>
<html>

<head>
    ${reportStyles}
    ${tableStyles}
</head>

<body>

<div class="header">
    <h1>HOSTEL APPLICANTS REPORT</h1>
    <p>Hostel Allocation Management System</p>
</div>

<div class="info-grid">

    <div class="info-item">
        <strong>Academic Year</strong>
        <span>${data.academicYear}</span>
    </div>

    <div class="info-item">
        <strong>Course</strong>
        <span>${data.course}</span>
    </div>

    <div class="info-item">
        <strong>Year</strong>
        <span>${data.year}</span>
    </div>

    <div class="info-item">
        <strong>Total Applicants</strong>
        <span>${data.applicants.length}</span>
    </div>

</div>

<h2 class="section-title">
    Applicant Details
</h2>

<table>

<thead>

<tr>

<th>Application No.</th>

<th>Name</th>

<th>Branch</th>

<th>Category</th>

<th>${data.year === "First Year" ? "Rank" : "CGPA"}</th>

<th>Contact</th>

</tr>

</thead>

<tbody>

${data.applicants
    .map(
        (student) => `
<tr>

<td>${
    data.year === "First Year"
        ? student.application_number
        : student.roll_no
}</td>

<td>${
    data.year === "First Year"
        ? student.name
        : student.name
}</td>

<td>${
    branchMap.get(student.branch_id) || "—"
}</td>

<td>${
    categoryMap.get(student.category_id) || "—"
}</td>

<td>${
    data.year === "First Year"
        ? student.rank ?? "—"
        : student.cgpa ?? "—"
}</td>

<td>${
    data.year === "First Year"
        ? student.personal_phone
        : student.phone_personal
}</td>

</tr>
`
    )
    .join("")}

</tbody>

</table>

<div class="footer">
    Generated on ${data.generatedAt}
</div>

</body>

</html>
`;
}
