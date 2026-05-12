/** Format seconds → M:SS */
export const fmt = (s) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
