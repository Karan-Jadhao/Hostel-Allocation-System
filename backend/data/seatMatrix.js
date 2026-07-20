export const seatMatrix = {
  "B.tech": {
    1: { // CS
      1: { seats: 4 }, // OPEN
      2: { seats: 2 }, // OBC
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    2: { // IT
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    3: { // TC
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    4: { // Electronics
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    5: { // ELETRICAL
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    6: { // MECH
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    7: { // CIVIL
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    8: { // Production
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    },

    9: { // Textile
      1: { seats: 4 },
      2: { seats: 2 },
      3: { pool: "SC" },
      4: { pool: "ST" },
      5: { pool: "VJDTNT" },
      6: { pool: "SEBC" },
      7: { pool: "EWS" }
    }
  },

  pools: {
    SC: {
      total: 13,
      remaining: 13,
      maxPerBranch: 2
    },

    ST: {
      total: 7,
      remaining: 7,
      maxPerBranch: 1
    },

    VJDTNT: {
      total: 11,
      remaining: 11,
      maxPerBranch: 2
    },

    SEBC: {
      total: 10,
      remaining: 10,
      maxPerBranch: 2
    },

    EWS: {
      total: 10,
      remaining: 10,
      maxPerBranch: 2
    },

    PWD: {
      total: 2,
      remaining: 2,
      maxPerBranch: 1
    },

    DEFENCE: {
      total: 2,
      remaining: 2,
      maxPerBranch: 1
    },

    ORPHAN: {
      total: 1,
      remaining: 1
    }
  }
};

export default seatMatrix;