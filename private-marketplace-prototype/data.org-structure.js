/* Dummy data for the Organizational structure page, matching the Figma
   "PMP admin - organizational structure 1" screen's tree table. */

const ORG_NODES = [
  { id: "org", parentId: null, depth: 0, type: "org", name: "Organization", accountId: "o-12345abcde", experience: "Default Experience", relationship: "Associated", expanded: true, hasChildren: true },
  { id: "dev-ou", parentId: "org", depth: 1, type: "ou", name: "Developer OU", accountId: "ou-12ab-1234abcd", experience: "ES Developers Experience", relationship: "Associated", expanded: true, hasChildren: true },
  { id: "primary-link", parentId: "dev-ou", depth: 2, type: "ou", name: "Primary link", accountId: "ou-12ab-2345bcde", experience: "Child OU Developer Experience", relationship: "Associated", expanded: true, hasChildren: true },
  { id: "shawn-account", parentId: "primary-link", depth: 3, type: "account", name: "Shawn's account", accountId: "123456789012", experience: "Child OU Developer Experience", relationship: "Inherited", expanded: false, hasChildren: false },
  { id: "designer-ou", parentId: "org", depth: 1, type: "ou", name: "Designer OU", accountId: "ou-12ab-3456cdef", experience: "Default Experience", relationship: "Inherited", expanded: false, hasChildren: true },
  { id: "designer-account-1", parentId: "designer-ou", depth: 2, type: "account", name: "Design team account", accountId: "234567890123", experience: "Default Experience", relationship: "Inherited", expanded: false, hasChildren: false },
  { id: "product-ou", parentId: "org", depth: 1, type: "ou", name: "Product OU", accountId: "ou-12ab-3456cdef", experience: "Default Experience", relationship: "Inherited", expanded: false, hasChildren: true },
  { id: "product-account-1", parentId: "product-ou", depth: 2, type: "account", name: "Product team account", accountId: "345678901234", experience: "Default Experience", relationship: "Inherited", expanded: false, hasChildren: false },
];
