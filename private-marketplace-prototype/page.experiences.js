/* Page wiring for experiences.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("experiences", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
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
      <h3>Learn more&nbsp;${Icons.externalLink}</h3>
      <a href="https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace.html" target="_blank" rel="noopener">Working with Private Marketplace</a>
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
  const selectedActiveIds = new Set();
  const activeTbody = document.querySelector("#active-exp-table tbody");
  const selectAllActive = document.getElementById("select-all-active-exp");
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
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => selectedActiveIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" ${selectedActiveIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="experience-details.html?id=${row.id}" class="truncate">${escapeHtml(row.name)}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
        <td>${row.lastModified}</td>
      </tr>
    `,
    selectedCountFn: () => selectedActiveIds.size,
    onRender: (visible) => {
      viewDetailsBtn.disabled = selectedActiveIds.size !== 1;
      archiveBtn.disabled = selectedActiveIds.size === 0;
      updateSelectAllCheckbox(selectAllActive, visible.filter((r) => selectedActiveIds.has(r.id)).length, visible.length);
    },
  });
  activeTable.render();

  activeTbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedActiveIds.add(id);
    else selectedActiveIds.delete(id);
    // Full re-render (not manual class toggling) so unchecking other rows
    // and recomputing corner-rounding both happen consistently.
    activeTable.render();
  });

  selectAllActive.addEventListener("change", (e) => {
    activeTbody.querySelectorAll(".row-check").forEach((cb) => {
      const id = cb.getAttribute("data-id");
      if (e.target.checked) selectedActiveIds.add(id);
      else selectedActiveIds.delete(id);
    });
    activeTable.render();
  });

  // ---- Archive confirmation modal (Cloudscape "type to confirm" pattern:
  // the destructive action stays disabled until the user types "confirm"). ----
  const archiveOverlay = document.getElementById("archive-modal-overlay");
  const archiveModal = document.getElementById("archive-modal");
  const archiveConfirmInput = document.getElementById("archive-confirm-input");
  const archiveConfirmBtn = document.getElementById("archive-modal-confirm");

  function openArchiveModal() {
    document.getElementById("archive-modal-count").textContent = `${selectedActiveIds.size} experience(s)`;
    archiveConfirmInput.value = "";
    archiveConfirmBtn.disabled = true;
    archiveOverlay.classList.add("open");
    archiveModal.classList.add("open");
    archiveConfirmInput.focus();
  }
  function closeArchiveModal() {
    archiveOverlay.classList.remove("open");
    archiveModal.classList.remove("open");
  }

  archiveConfirmInput.addEventListener("input", () => {
    archiveConfirmBtn.disabled = archiveConfirmInput.value.trim().toLowerCase() !== "confirm";
  });
  archiveOverlay.addEventListener("click", closeArchiveModal);
  document.getElementById("archive-modal-close").addEventListener("click", closeArchiveModal);
  document.getElementById("archive-modal-cancel").addEventListener("click", closeArchiveModal);

  document.getElementById("archive-exp-btn").addEventListener("click", () => {
    if (selectedActiveIds.size === 0) return;
    openArchiveModal();
  });

  archiveConfirmBtn.addEventListener("click", () => {
    const moved = ACTIVE_EXPERIENCES.filter((e) => selectedActiveIds.has(e.id));
    moved.forEach((e) => {
      const idx = ACTIVE_EXPERIENCES.indexOf(e);
      ACTIVE_EXPERIENCES.splice(idx, 1);
      ARCHIVED_EXPERIENCES.unshift({ ...e, status: "notlive", statusLabel: "Not live" });
    });
    const message = moved.length === 1 ? `Experience '${escapeHtml(moved[0].name)}' was archived.` : `${moved.length} experiences were archived.`;
    selectedActiveIds.clear();
    activeTable.setData(ACTIVE_EXPERIENCES);
    archivedTable.setData(ARCHIVED_EXPERIENCES);
    closeArchiveModal();
    showFlash(document.getElementById("flash-root"), { type: "success", message, autoDismiss: 4000 });
  });

  document.getElementById("view-details-btn").addEventListener("click", () => {
    const id = [...selectedActiveIds][0];
    if (id) window.location.href = `experience-details.html?id=${id}`;
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
        <td><a href="experience-details.html?id=${row.id}" class="truncate">${escapeHtml(row.name)}</a></td>
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
