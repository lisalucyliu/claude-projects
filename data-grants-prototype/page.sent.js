/* Page wiring for sent-data-grants.html */

function stateHtml(state, label) {
  if (state === "processing") {
    return `<span class="status status--processing"><span class="spin">${Icons.statusProcessing}</span>${label}</span>`;
  }
  return `<span class="status status--completed">${Icons.statusAccepted}${label}</span>`;
}

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("sent", "Sent data grants");
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Sent data grants",
    `
    <h3>Sent data grants</h3>
    <p>A data grant gives another AWS account free, revocable access to one of your owned data sets for a specified duration. Use this page to view and manage the data grants you've created and sent to other AWS accounts.</p>
    <h3>How data grants work</h3>
    <ul>
      <li>Create an owned data set to prepare the content you want to share.</li>
      <li>Create and send a data grant by specifying a name, description, the data set, the recipient's AWS account ID, and an optional expiration date.</li>
      <li>The recipient accepts the data grant to gain access to the underlying data set.</li>
    </ul>
    <div class="help-panel__links">
      <h3>Learn more</h3>
      <a href="https://docs.aws.amazon.com/data-exchange/latest/userguide/creating-data-grants.html" target="_blank" rel="noopener">Creating data grants ${Icons.externalLink}</a>
      <a href="https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html" target="_blank" rel="noopener">AWS Data Exchange user guide ${Icons.externalLink}</a>
    </div>
    `
  );

  // ---- Sent data grants table ----
  let showExpired = false;
  const selectedGrantIds = new Set();
  const grantsTbody = document.querySelector("#sent-grants-table tbody");

  const sentTable = new DataTable({
    root: document.getElementById("grants-panel"),
    data: SENT_GRANTS,
    pageSize: 10,
    searchFields: ["name", "receiverAwsId", "statusLabel"],
    filterFn: (row) => showExpired || row.status !== "expired",
    countUsesTotal: true,
    colspan: 6,
    emptyHtml: `<div class="empty-state">No grants<button class="btn btn-normal" id="empty-create-grant-btn">Create data grant</button></div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}" class="${selectedGrantIds.has(row.id) ? "selected" : ""}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" ${selectedGrantIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
        <td>${row.expiration}</td>
        <td>${row.receiverAwsId}</td>
        <td>${row.creation}</td>
      </tr>
    `,
    onRender: updateActionsState,
  });
  sentTable.render();

  function updateActionsState() {
    const count = selectedGrantIds.size;
    document.querySelector('[data-action="view"]').disabled = count !== 1;
    document.querySelector('[data-action="revoke"]').disabled = count === 0;
    document.querySelector('[data-action="delete"]').disabled = count === 0;
  }

  grantsTbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedGrantIds.add(id);
    else selectedGrantIds.delete(id);
    e.target.closest("tr").classList.toggle("selected", e.target.checked);
    updateActionsState();
  });

  grantsTbody.addEventListener("click", (e) => {
    if (e.target.closest("#empty-create-grant-btn")) {
      document.getElementById("create-grant-btn").click();
    }
  });

  document.getElementById("select-all-grants").addEventListener("change", (e) => {
    grantsTbody.querySelectorAll(".row-check").forEach((cb) => {
      cb.checked = e.target.checked;
      cb.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  document.getElementById("show-expired-toggle").addEventListener("change", (e) => {
    showExpired = e.target.checked;
    sentTable.render();
  });

  document.getElementById("refresh-grants").addEventListener("click", () => sentTable.render());

  document.querySelectorAll(".dropdown-menu [data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const labels = { view: "Viewing data grant details", revoke: "Data grant revoked", delete: "Data grant deleted" };
      showFlash(document.getElementById("flash-root"), { type: "success", message: labels[btn.getAttribute("data-action")] || "Done", autoDismiss: 4000 });
    });
  });

  // ---- Activity history / Jobs table ----
  const jobsTbody = document.querySelector("#jobs-table tbody");
  const jobsTable = new DataTable({
    root: document.getElementById("activity-panel"),
    data: JOBS,
    pageSize: 10,
    searchFields: [],
    countUsesTotal: true,
    colspan: 5,
    emptyHtml: `<div class="empty-state">No jobs</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}">
        <td class="checkbox-col"><input type="checkbox" class="job-check" data-id="${row.id}" /></td>
        <td>${row.type}</td>
        <td><span class="truncate">${row.details}</span></td>
        <td>${stateHtml(row.state, row.stateLabel)}</td>
        <td>${row.created}</td>
      </tr>
    `,
  });
  jobsTable.render();

  document.getElementById("refresh-jobs").addEventListener("click", () => jobsTable.render());

  // ---- Create data grant flow (simulated) ----
  let createCounter = 1;
  document.getElementById("create-grant-btn").addEventListener("click", () => {
    const grantName = `test object ${createCounter++}`;
    const flashRoot = document.getElementById("flash-root");
    const inProgressFlash = showFlash(flashRoot, {
      type: "in-progress",
      message: `Your creation of data grant '${grantName}' is currently in progress and may take some time. You can safely navigate away from this page and check back later.`,
    });

    const newJob = {
      id: `job-new-${Date.now()}`,
      type: "Create data grant",
      details: `Source data set ID: ${JOB_SOURCE_ID}`,
      state: "processing",
      stateLabel: "Processing",
      created: "Just now",
      createdSort: new Date(),
    };
    JOBS.unshift(newJob);
    jobsTable.setData(JOBS);

    setTimeout(() => {
      inProgressFlash.remove();
      showFlash(flashRoot, { type: "success", message: `Data grant '${grantName}' was created successfully.`, autoDismiss: 5000 });

      newJob.state = "completed";
      newJob.stateLabel = "Completed";
      jobsTable.refresh();

      const newGrant = {
        id: `grant-new-${Date.now()}`,
        name: grantName,
        status: "pending",
        statusLabel: "Pending acceptance",
        expiration: "No end date",
        receiverAwsId: "—",
        creation: "Just now",
        expirationSort: new Date(8640000000000000),
        creationSort: new Date(),
      };
      SENT_GRANTS.unshift(newGrant);
      sentTable.setData(SENT_GRANTS);
    }, 3000);
  });
});
