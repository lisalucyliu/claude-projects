/* Page wiring for dashboard.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("dashboard", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "dashboard.html" },
    { label: "Dashboard" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Dashboard",
    `
    <h3>Dashboard</h3>
    <p>The dashboard summarizes your organization's Private Marketplace governance: which products have been approved, declined or blocked, and the full AWS Marketplace catalog they were reviewed against.</p>
    <h3>Governance details</h3>
    <p>Shows the management account for your organization and the default experience new accounts are governed by.</p>
    <div class="help-panel__links">
      <h3>Learn more&nbsp;${Icons.externalLink}</h3>
      <a href="https://aws.amazon.com/marketplace/features/private-marketplace" target="_blank" rel="noopener">About AWS Private Marketplace</a>
    </div>
    `
  );

  // The success flash only appears once a bulk action actually completes —
  // the bulk-update-products.html wizard hands the result off via
  // sessionStorage (each page load re-parses this script fresh, so it can't
  // ride along in memory across navigation) and this page consumes it once.
  const flashRoot = document.getElementById("flash-root");
  const bulkResultRaw = sessionStorage.getItem("pmp-bulk-update-result");
  if (bulkResultRaw) {
    sessionStorage.removeItem("pmp-bulk-update-result");
    const result = JSON.parse(bulkResultRaw);
    const verb = result.method === "add" ? "added to" : "removed from";
    showFlash(flashRoot, {
      type: "success",
      message: `<strong>Bulk ${result.method} product process started successfully</strong><br>${result.productCount} product${result.productCount === 1 ? "" : "s"} ${result.productCount === 1 ? "is" : "are"} being ${verb} ${result.experienceCount} experience${result.experienceCount === 1 ? "" : "s"}`,
      action: { label: "View change set", onClick: () => {} },
    });
  }

  const selectedApprovedIds = new Set();
  const selectAllApproved = document.getElementById("select-all-approved");

  const table = new DataTable({
    root: document.getElementById("approved-panel"),
    data: APPROVED_PRODUCTS,
    pageSize: 10,
    searchFields: ["product", "vendor"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No approved products</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => selectedApprovedIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" ${selectedApprovedIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.vendor)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.approvedIn)}</a></td>
      </tr>
    `,
    selectedCountFn: () => selectedApprovedIds.size,
    onRender: (visible) => {
      document.getElementById("remove-approved-btn").disabled = selectedApprovedIds.size === 0;
      updateSelectAllCheckbox(selectAllApproved, visible.filter((r) => selectedApprovedIds.has(r.id)).length, visible.length);
    },
  });
  table.render();

  const tbody = document.querySelector("#approved-table tbody");
  tbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedApprovedIds.add(id);
    else selectedApprovedIds.delete(id);
    // Full re-render (not just toggling this row's class) so neighboring
    // rows recompute their selected--top/bottom corner-rounding too.
    table.render();
  });

  document.getElementById("select-all-approved").addEventListener("change", (e) => {
    tbody.querySelectorAll(".row-check").forEach((cb) => {
      const id = cb.getAttribute("data-id");
      if (e.target.checked) selectedApprovedIds.add(id);
      else selectedApprovedIds.delete(id);
    });
    table.render();
  });

  document.getElementById("refresh-approved").addEventListener("click", () => table.render());
});
