/* Dummy data for the "Create experience" wizard, matching the Figma
   "PMP admin - new experience step 1-5" screens. */

const WIZARD_ALL_PRODUCTS = [
  { id: "wp-1", product: "Red Hat Enterprise Linux 9", vendor: "Amazon Web Services", approvedIn: "0 experiences" },
  { id: "wp-2", product: "Microsoft Windows Server 2022 Base", vendor: "Amazon Web Services", approvedIn: "1 experiences" },
  { id: "wp-3", product: "Hubs Cloud Enterprise", vendor: "Mozilla", approvedIn: "1+ experience" },
  { id: "wp-4", product: "Trend Micro Deep Security", vendor: "Trend Micro", approvedIn: "3+ experiences" },
  { id: "wp-5", product: "Text to SQL using LLM", vendor: "Mphasis", approvedIn: "2+ experiences" },
];

const WIZARD_BULK_EXPERIENCES = [
  { id: "we-1", name: "ES Developer Experience", status: "live" },
  { id: "we-2", name: "BMX Developer Experience", status: "live" },
  { id: "we-3", name: "Test Developer Experience", status: "live" },
  { id: "we-4", name: "UX Experience", status: "live" },
  { id: "we-5", name: "Product Experience", status: "live" },
].map((row) => ({ ...row, statusLabel: "Live" }));

const WIZARD_ORG_NODES = [
  { id: "w-org", parentId: null, depth: 0, type: "org", name: "Organization", accountId: "o-12345abcde", experience: "Default Experience", relationship: "Associated", expanded: true, hasChildren: true },
  { id: "w-dev-ou", parentId: "w-org", depth: 1, type: "ou", name: "Developer OU", accountId: "ou-12ab-1234abcd", experience: "ES Developers Experience", relationship: "Associated", expanded: false, hasChildren: true },
  { id: "w-designer-ou", parentId: "w-org", depth: 1, type: "ou", name: "Designer OU", accountId: "ou-12ab-3456cdef", experience: "Default Experience", relationship: "Inherited", expanded: false, hasChildren: true },
  { id: "w-product-ou", parentId: "w-org", depth: 1, type: "ou", name: "Product OU", accountId: "ou-12ab-3456cdef", experience: "Default Experience", relationship: "Inherited", expanded: false, hasChildren: true },
];
