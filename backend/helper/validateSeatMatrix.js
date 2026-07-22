export const validateSeatMatrix = (seatMatrix, branches, students) => {
  if (!seatMatrix || Object.keys(seatMatrix).length === 0) {
    throw new Error("No seat matrix has been configured for this selection.");
  }
  if (!branches?.length) throw new Error("No branches were found for this course.");
  if (!students?.length) throw new Error("No submitted applications were found for this selection.");
  if (!seatMatrix[1]) throw new Error("Open-category seats must be configured before allocation.");

  for (const category of Object.values(seatMatrix)) {
    if (category.perBranchSeats < 0 || category.extraSeats < 0) {
      throw new Error("Seat counts cannot be negative.");
    }
  }
};
