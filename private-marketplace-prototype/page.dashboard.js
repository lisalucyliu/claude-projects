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

  const flashRoot = document.getElementById("flash-root");
  showFlash(flashRoot, {
    type: "success",
    message: `<strong>Bulk add product process started successfully</strong><br>2 products are being added to 2 experiences`,
    action: { label: "View change set", onClick: () => {} },
  });

  const table = new DataTable({
    root: document.getElementById("approved-panel"),
    data: APPROVED_PRODUCTS,
    pageSize: 10,
    searchFields: ["product", "vendor"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No approved products</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)} ${Icons.externalLink}</a></td>
        <td><a href="#" onclick="return false;">${escapeHtml(row.vendor)} ${Icons.externalLink}</a></td>
        <td><a href="#" onclick="return false;">${escapeHtml(row.approvedIn)} ${Icons.externalLink}</a></td>
      </tr>
    `,
    onRender: () => {
      const anyChecked = document.querySelectorAll("#approved-table .row-check:checked").length > 0;
      document.getElementById("remove-approved-btn").disabled = !anyChecked;
    },
  });
  table.render();

  const tbody = document.querySelector("#approved-table tbody");
  tbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    document.getElementById("remove-approved-btn").disabled =
      document.querySelectorAll("#approved-table .row-check:checked").length === 0;
  });

  document.getElementById("select-all-approved").addEventListener("change", (e) => {
    tbody.querySelectorAll(".row-check").forEach((cb) => {
      cb.checked = e.target.checked;
    });
    document.getElementById("remove-approved-btn").disabled =
      document.querySelectorAll("#approved-table .row-check:checked").length === 0;
  });

  document.getElementById("refresh-approved").addEventListener("click", () => table.render());

  document.getElementById("bulk-update-btn").addEventListener("click", () => {
    showFlash(flashRoot, {
      type: "in-progress",
      message: "Bulk update product process started. This may take a few minutes.",
      autoDismiss: 5000,
    });
  });
});
