import { reportStyles } from "./styles/report.styles.js";
import { tableStyles } from "./styles/table.styles.js";

export function seatMatrixTemplate(data) {

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

    <h1>HOSTEL SEAT MATRIX REPORT</h1>

    <p>Hostel Allocation Management System</p>

</div>

<div class="info-grid">

    <div class="info-item">
        <strong>Academic Year:</strong>
        <span>${data.academicYear}</span>
    </div>

    <div class="info-item">
        <strong>Course:</strong>
        <span>${data.course}</span>
    </div>

    <div class="info-item">
        <strong>Year:</strong>
        <span>${data.year}</span>
    </div>

    <div class="info-item">
        <strong>Generated:</strong>
        <span>${data.generatedAt}</span>
    </div>

</div>

<h2 class="section-title">

Seat Matrix

</h2>

<table>

<thead>

<tr>

<th>Category</th>

<th>Per Branch Seats</th>

<th>Extra Seats</th>

<th>Total Seats</th>

</tr>

</thead>

<tbody>

${data.seatMatrix
    .map(
        (seat) => `
<tr>

<td>
${categoryMap.get(seat.category_id) || "—"}
</td>

<td>
${seat.per_branch_seats}
</td>

<td>
${seat.extra_seats}
</td>

<td>
${(seat.per_branch_seats * data.branchCount) + seat.extra_seats}
</td>

</tr>
`
    )
    .join("")}

</tbody>

</table>

<div class="footer">

VJTI HOSTEL COMMITTEE

</div>

</body>

</html>
`;
}