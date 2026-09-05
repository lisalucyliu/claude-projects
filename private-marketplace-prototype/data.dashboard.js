/* Dummy data for the Dashboard page, matching the release 2 "Managed
   products" wireframe (merges the old Approved + Declined/blocked
   tables into one, with both an "Approved in" and a "Declined/blocked
   in" column per product). */

const MANAGED_PRODUCTS = [
  { product: "Hubs Cloud Enterprise", vendor: "Mozilla", approvedIn: "1+ Experiences", declinedIn: "1+ Experiences" },
  { product: "Trend Micro Deep Security", vendor: "Trend Micro", approvedIn: "3+ Experiences", declinedIn: "0 Experiences" },
  { product: "Microsoft Windows Server 2022 Base", vendor: "Amazon Web Services", approvedIn: "4+ Experiences", declinedIn: "0 Experiences" },
  { product: "Text to SQL using LLM", vendor: "Mphasis", approvedIn: "2+ Experiences", declinedIn: "1+ Experiences" },
].map((row, i) => ({ id: `product-${i}`, ...row }));
