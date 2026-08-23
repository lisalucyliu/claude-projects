/* Dummy data for the Experiences page, matching the Figma "PMP admin - experiences" screen. */

const ACTIVE_EXPERIENCES = [
  { name: "ES Developer Experience", status: "live", lastModified: "Apr 16, 2024" },
  { name: "BMX Developer Experience", status: "live", lastModified: "Mar 16, 2024" },
  { name: "eProcurement Developer Experience", status: "notlive", lastModified: "Feb 16, 2024" },
  { name: "UX Experience", status: "notlive", lastModified: "Jan 16, 2024" },
  { name: "Product Experience", status: "live", lastModified: "Dec 16, 2022" },
].map((row, i) => ({
  id: `exp-${i}`,
  ...row,
  statusLabel: { live: "Live", notlive: "Not live" }[row.status],
  modifiedSort: parseDate(row.lastModified),
}));

const ARCHIVED_EXPERIENCES = [
  { name: "Legacy Contractor Experience", status: "notlive", lastModified: "Jun 2, 2022" },
].map((row, i) => ({
  id: `archived-exp-${i}`,
  ...row,
  statusLabel: { live: "Live", notlive: "Not live" }[row.status],
  modifiedSort: parseDate(row.lastModified),
}));
