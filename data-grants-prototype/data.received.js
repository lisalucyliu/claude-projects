/* Dummy data for the Received data grants page, styled after the original wireframes. */

const PENDING_GRANTS = [
  { name: "test object 1", status: "pending", start: "September 5, 2023", expiration: "No end date" },
  { name: "test object 2", status: "pending", start: "December 28, 2022", expiration: "December 28, 2024" },
  { name: "test object 3", status: "pending", start: "December 27, 2022", expiration: "December 27, 2024" },
].map((row, i) => ({
  id: `pending-${i}`,
  ...row,
  statusLabel: "Pending acceptance",
  startSort: parseDate(row.start),
  expirationSort: row.expiration === "No end date" ? new Date(8640000000000000) : parseDate(row.expiration),
}));

const ACCEPTED_GRANTS = [
  { name: "test object success", status: "accepted", start: "January 8, 2023", expiration: "No end date" },
  { name: "test object with Company A", status: "expired", start: "November 10, 2021", expiration: "December 28, 2024" },
  { name: "test object with Company B", status: "expired", start: "November 10, 2021", expiration: "December 27, 2024" },
].map((row, i) => ({
  id: `accepted-${i}`,
  ...row,
  statusLabel: { accepted: "Accepted", expired: "Expired" }[row.status],
  startSort: parseDate(row.start),
  expirationSort: row.expiration === "No end date" ? new Date(8640000000000000) : parseDate(row.expiration),
}));
