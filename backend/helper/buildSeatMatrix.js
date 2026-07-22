export const buildSeatMatrix = (seatRows = []) => {
  return seatRows.reduce((matrix, row) => {
    matrix[row.category_id] = {
      perBranchSeats: Number(row.per_branch_seats) || 0,
      extraSeats: Number(row.extra_seats) || 0,
      remainingExtraSeats: Number(row.extra_seats) || 0,
    };
    return matrix;
  }, {});
};
