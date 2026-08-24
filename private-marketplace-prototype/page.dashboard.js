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
      <h3>Learn more</h3>
      <a href="https://aws.amazon.com/marketplace/features/private-marketplace" target="_blank" rel="noopener">About AWS Private Marketplace ${Icons.externalLink}</a>
    </div>
    `
  );

  // The success flash only appears once a bulk action actually completes
  // (see bulk-update-btn below) — not unconditionally on page load.
  const flashRoot = document.getElementById("flash-root");

  const selectedApprovedIds = new Set();

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
    onRender: () => {
      document.getElementById("remove-approved-btn").disabled = selectedApprovedIds.size === 0;
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

  document.getElementById("bulk-update-btn").addEventListener("click", () => {
    const inProgress = showFlash(flashRoot, {
      type: "in-progress",
      message: "Bulk update product process started. This may take a few minutes.",
    });
    setTimeout(() => {
      inProgress.remove();
      showFlash(flashRoot, {
        type: "success",
        message: `<strong>Bulk add product process started successfully</strong><br>2 products are being added to 2 experiences`,
        action: { label: "View change set", onClick: () => {} },
        autoDismiss: 6000,
      });
    }, 3000);
  });
});
