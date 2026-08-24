/* Page wiring for change-set-details.html */

document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const cs = findChangeSet(id) || CHANGE_SETS[0];
  const hasMultiple = cs.changes.length > 1;
  const label = hasMultiple ? `${cs.changeType} + more` : cs.changeType;

  mountChrome("change-sets", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
    { label: "Change sets", href: "change-sets.html" },
    { label },
  ]);
  hydrateIcons();
  initSharedUI();
  document.title = `Change set details: ${label} — AWS Marketplace`;
  document.getElementById("cs-heading").innerHTML = `Change set details: ${label}`;

  initHelpPanel(
    "Change set details",
    `<h3>Change set details</h3><p>View the full details of a change set, including its status, timing, and — if it failed — the error that occurred. Select an individual change below to see its own details.</p>`
  );

  document.getElementById("cs-status").innerHTML = statusHtml(cs.status, cs.statusLabel);
  document.getElementById("cs-id").textContent = cs.changeSetId || cs.id;
  document.getElementById("cs-arn").textContent = cs.arn || "-";
  document.getElementById("cs-start").textContent = cs.startTime;
  document.getElementById("cs-end").textContent = cs.endTime || "-";

  const hasError = cs.status === "error";
  document.getElementById("cs-error-code-field").style.display = hasError ? "" : "none";
  document.getElementById("cs-error-desc-field").style.display = hasError ? "" : "none";
  if (hasError) {
    document.getElementById("cs-error-code").textContent = cs.errorCode;
    document.getElementById("cs-error-desc").textContent = cs.errorDescription;
  }

  document.getElementById("copy-arn").addEventListener("click", () => {
    if (!cs.arn) return;
    navigator.clipboard?.writeText(cs.arn);
    showFlash(document.getElementById("flash-root"), { type: "success", message: "ARN copied to clipboard.", autoDismiss: 3000 });
  });

  document.getElementById("refresh-cs-details").addEventListener("click", () => window.location.reload());

  // ---- Changes table ----
  let selectedChangeId = null;
  const viewChangeBtn = document.getElementById("view-change-details-btn");

  const changesTable = new DataTable({
    root: document.getElementById("changes-panel"),
    data: cs.changes,
    pageSize: 10,
    countUsesTotal: true,
    colspan: 5,
    emptyHtml: `<div class="empty-state">No changes</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}" class="${selectedChangeId === row.id ? "selected selected--top selected--bottom" : ""}">
        <td class="radio-col"><input type="radio" name="change-radio" class="row-radio" data-id="${row.id}" ${selectedChangeId === row.id ? "checked" : ""} /></td>
        <td><a href="change-details.html?id=${row.id}" class="truncate">${row.changeType}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
        <td>${row.entityIdentifier}</td>
        <td>${row.entityType}</td>
      </tr>
    `,
  });
  changesTable.render();

  document.querySelector("#changes-panel tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-radio")) return;
    selectedChangeId = e.target.getAttribute("data-id");
    viewChangeBtn.disabled = false;
    changesTable.render();
  });

  viewChangeBtn.addEventListener("click", () => {
    if (selectedChangeId) window.location.href = `change-details.html?id=${selectedChangeId}`;
  });
});
