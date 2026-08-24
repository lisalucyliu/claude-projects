/* Page wiring for private-marketplace.html — the Private Marketplace feature
   homepage, using the hero-header pattern (cloudscape.design/patterns/
   general/hero-header/). Static content page: no tables, no forms. */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("private-marketplace", [{ label: "AWS Marketplace", href: "dashboard.html" }, { label: "Private Marketplace" }]);
  hydrateIcons();
  initSharedUI();
});
