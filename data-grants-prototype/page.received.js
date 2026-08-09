/* Page wiring for received-data-grants.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("received");
  document.getElementById("breadcrumb-root").innerHTML = renderBreadcrumb("Received data grants");
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Received data grants",
    `
    <h3>Received data grants</h3>
    <p>A data grant gives your AWS account free, revocable access to a data set owned by another AWS account. Data grants you've been sent appear here until you accept, decline, or they expire.</p>
    <h3>Pending data grants</h3>
    <p>Granted data sets that are waiting for your acceptance. Select a data grant and choose <strong>Accept data grant</strong> to gain access to its underlying data set.</p>
    <h3>Accepted and expired data grants</h3>
    <p>Data grants you've already accepted, plus any that expired before or after acceptance.</p>
    <div class="help-panel__links">
      <h3>Learn more</h3>
      <a href="https://docs.aws.amazon.com/data-exchange/latest/userguide/creating-data-grants.html" target="_blank" rel="noopener">Creating data grants ${Icons.externalLink}</a>
      <a href="https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html" target="_blank" rel="noopener">AWS Data Exchange user guide ${Icons.externalLink}</a>
    </div>
    `
  );

  // ---- Pending data grants table ----
  let selectedPendingId = null;
  const pendingTbody = document.querySelector("#pending-grants-table tbody");
  const acceptBtn = document.getElementById("accept-grant-btn");

  const pendingTable = new DataTable({
    root: document.getElementById("pending-panel"),
    data: PENDING_GRANTS,
    pageSize: 10,
    searchFields: ["name"],
    countUsesTotal: true,
    colspan: 5,
    emptyHtml: `<div class="empty-state">No pending data grants</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}" class="${selectedPendingId === row.id ? "selected" : ""}">
        <td class="radio-col"><input type="radio" name="pending-select" class="row-radio" data-id="${row.id}" ${selectedPendingId === row.id ? "checked" : ""} /></td>
        <td><a href="#" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
        <td>${row.start}</td>
        <td>${row.expiration}</td>
      </tr>
    `,
  });
  pendingTable.render();

  pendingTbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-radio")) return;
    selectedPendingId = e.target.getAttribute("data-id");
    pendingTbody.querySelectorAll("tr").forEach((tr) => {
      tr.classList.toggle("selected", tr.getAttribute("data-row-id") === selectedPendingId);
    });
    acceptBtn.disabled = false;
  });

  // ---- Accepted and expired data grants table ----
  const acceptedTable = new DataTable({
    root: document.getElementById("accepted-panel"),
    data: ACCEPTED_GRANTS,
    pageSize: 10,
    searchFields: ["name"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No accepted or expired data grants</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}">
        <td><a href="#" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
        <td>${row.start}</td>
        <td>${row.expiration}</td>
      </tr>
    `,
  });
  acceptedTable.render();

  // ---- Accept data grant flow (simulated) ----
  acceptBtn.addEventListener("click", () => {
    if (!selectedPendingId) return;
    const idx = PENDING_GRANTS.findIndex((g) => g.id === selectedPendingId);
    if (idx === -1) return;
    const grant = PENDING_GRANTS[idx];

    PENDING_GRANTS.splice(idx, 1);
    selectedPendingId = null;
    acceptBtn.disabled = true;
    pendingTable.setData(PENDING_GRANTS);

    ACCEPTED_GRANTS.unshift({
      ...grant,
      status: "accepted",
      statusLabel: "Accepted",
    });
    acceptedTable.setData(ACCEPTED_GRANTS);

    showFlash(document.getElementById("flash-root"), {
      type: "success",
      message: `Data grant '${escapeHtml(grant.name)}' was accepted. You now have access to its data set.`,
      autoDismiss: 5000,
    });

    document.querySelector('.tab[data-tab="accepted"]').click();
  });
});
