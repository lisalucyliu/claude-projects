/* Page wiring for experiences.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("experiences", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "dashboard.html" },
    { label: "Experiences" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Experiences",
    `
    <h3>Experiences</h3>
    <p>An experience is a governed subsection of AWS Marketplace containing a curated, custom-branded catalog of approved products. Associate an experience with organizational units or accounts to control what your users can discover and request.</p>
    <div class="help-panel__links">
      <h3>Learn more</h3>
      <a href="https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace.html" target="_blank" rel="noopener">Working with Private Marketplace ${Icons.externalLink}</a>
    </div>
    `
  );

  // Merge in an experience just created by the wizard, if any.
  const pendingNew = sessionStorage.getItem("pmp-created-experience");
  let justCreatedName = null;
  if (pendingNew) {
    const parsed = JSON.parse(pendingNew);
    justCreatedName = parsed.name;
    ACTIVE_EXPERIENCES.unshift({ ...parsed, modifiedSort: new Date() });
    sessionStorage.removeItem("pmp-created-experience");
  }

  // ---- Active experiences ----
  let selectedActiveId = null;
  const activeTbody = document.querySelector("#active-exp-table tbody");
  const viewDetailsBtn = document.getElementById("view-details-btn");
  const archiveBtn = document.getElementById("archive-exp-btn");

  const activeTable = new DataTable({
    root: document.getElementById("active-exp-panel"),
    data: ACTIVE_EXPERIENCES,
    pageSize: 10,
    searchFields: ["name"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No active experiences</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}" class="${selectedActiveId === row.id ? "selected" : ""}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" ${selectedActiveId === row.id ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
        <td>${row.lastModified}</td>
      </tr>
    `,
  });
  activeTable.render();

  activeTbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) {
      // single-select: uncheck any other checked row
      activeTbody.querySelectorAll(".row-check").forEach((cb) => {
        if (cb !== e.target) cb.checked = false;
      });
      selectedActiveId = id;
    } else if (selectedActiveId === id) {
      selectedActiveId = null;
    }
    activeTbody.querySelectorAll("tr").forEach((tr) => {
      tr.classList.toggle("selected", tr.getAttribute("data-row-id") === selectedActiveId);
    });
    viewDetailsBtn.disabled = !selectedActiveId;
    archiveBtn.disabled = !selectedActiveId;
  });

  document.getElementById("select-all-active-exp").addEventListener("change", () => {
    // header select-all not meaningful for single-select; no-op visually but keep checkbox in sync
    document.getElementById("select-all-active-exp").checked = false;
  });

  document.getElementById("archive-exp-btn").addEventListener("click", () => {
    if (!selectedActiveId) return;
    const idx = ACTIVE_EXPERIENCES.findIndex((e) => e.id === selectedActiveId);
    const [moved] = ACTIVE_EXPERIENCES.splice(idx, 1);
    ARCHIVED_EXPERIENCES.unshift({ ...moved, status: "notlive", statusLabel: "Not live" });
    selectedActiveId = null;
    viewDetailsBtn.disabled = true;
    archiveBtn.disabled = true;
    activeTable.setData(ACTIVE_EXPERIENCES);
    archivedTable.setData(ARCHIVED_EXPERIENCES);
    showFlash(document.getElementById("flash-root"), { type: "success", message: `Experience '${escapeHtml(moved.name)}' was archived.`, autoDismiss: 4000 });
  });

  document.getElementById("view-details-btn").addEventListener("click", () => {
    showFlash(document.getElementById("flash-root"), { type: "info", message: "Experience details view is not part of this prototype yet.", autoDismiss: 4000 });
  });

  // Clicking "Create experience" launches the 5-step wizard.
  document.getElementById("create-experience-btn").addEventListener("click", () => {
    window.location.href = "create-experience.html";
  });

  // ---- Archived experiences ----
  const archivedTable = new DataTable({
    root: document.getElementById("archived-exp-panel"),
    data: ARCHIVED_EXPERIENCES,
    pageSize: 10,
    searchFields: ["name"],
    countUsesTotal: true,
    colspan: 3,
    emptyHtml: `<div class="empty-state">No archived experiences</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}">
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
        <td>${row.lastModified}</td>
      </tr>
    `,
  });
  archivedTable.render();

  if (justCreatedName) {
    showFlash(document.getElementById("flash-root"), {
      type: "success",
      message: `Experience '${escapeHtml(justCreatedName)}' was created successfully.`,
      autoDismiss: 6000,
    });
  }
});
