/* Dummy data for the Dashboard page, matching the Figma "PMP home - admin" screen. */

const APPROVED_PRODUCTS = [
  { product: "Hubs Cloud Enterprise", vendor: "Mozilla", approvedIn: "1+ experience" },
  { product: "Trend Micro Deep Security", vendor: "Trend Micro", approvedIn: "3+ experiences" },
  { product: "Microsoft Windows Server 2022 Base", vendor: "Amazon Web Services", approvedIn: "4+ experiences" },
  { product: "Text to SQL using LLM", vendor: "Mphasis", approvedIn: "2+ experiences" },
  { product: "Red Hat Enterprise Linux 9", vendor: "Amazon Web Services", approvedIn: "0 experiences" },
  { product: "Microsoft Windows Server 2022 Base (Trial)", vendor: "Amazon Web Services", approvedIn: "1 experience" },
].map((row, i) => ({ id: `product-${i}`, ...row }));
