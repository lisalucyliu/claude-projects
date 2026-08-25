/* Page wiring for settings.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("settings", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Settings" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Settings",
    `
    <p>This page gives you access to general settings for AWS Marketplace.</p>
    <h3>Integrations</h3>
    <p><strong>Service-linked role:</strong> Enabling this role allows the trusted service to perform the tasks that are described in the trusted services documentation. The trusted service is notified about any changes to your organization and can perform additional tasks in response to those notifications.</p>
    <p><strong>Trusted access:</strong> Enabling trusted access designates Private Marketplace as a trusted service in your organization. A trusted service can query the organization's structure and create a service-linked role in the management account of the organization.</p>
    <p>Note: Once an integration is created, you can't undo this action on this page. Visit <a href="#" onclick="return false;">IAM</a> to delete SLRs, or <a href="#" onclick="return false;">AWS Organizations</a> to disable trusted access.</p>
    <h3>Delegated administrators</h3>
    <p>Delegate other accounts permission to perform administrative tasks (excluding configuring settings) for the organization.</p>
    <div class="help-panel__links">
      <a href="#" onclick="return false;">Secondary link</a>
      <a href="#" onclick="return false;">Secondary link</a>
      <a href="#" onclick="return false;">Secondary link</a>
      <a href="#" onclick="return false;">Secondary link</a>
      <a href="#" onclick="return false;">Secondary link</a>
    </div>
    `
  );

  // edit-integrations.html is shared by two entry points — Private
  // Marketplace settings' "Edit integrations" and Deployment parameters
  // integration's "Edit integration" — so it hands back which target it
  // was creating, and we flip that specific card's status + show its own
  // success flash (same sessionStorage handoff pattern as dashboard.html's
  // bulk-update-result).
  const flashRoot = document.getElementById("flash-root");
  const integrationTarget = sessionStorage.getItem("pmp-integration-created");
  if (integrationTarget) {
    sessionStorage.removeItem("pmp-integration-created");

    if (integrationTarget === "pms") {
      document.getElementById("pms-status-columns").innerHTML = `
        <dl class="info-card__column">
          <div class="info-card__field">
            <dt>Service-linked role</dt>
            <dd><span class="status status--accepted"><span data-icon="statusAccepted"></span>Successfully created</span></dd>
          </div>
        </dl>
        <dl class="info-card__column">
          <div class="info-card__field">
            <dt>Trusted access</dt>
            <dd><span class="status status--accepted"><span data-icon="statusAccepted"></span>Successfully created</span></dd>
          </div>
        </dl>
      `;
      hydrateIcons(document.getElementById("pms-status-columns"));
      document.getElementById("pms-edit-integrations-link")?.remove();
      showFlash(flashRoot, { type: "success", message: "Service-linked role and trusted access integrations have been successfully created.", autoDismiss: 4000 });
    } else if (integrationTarget === "deployment") {
      document.getElementById("deployment-params-status").innerHTML = `
        <dt>Service-linked role</dt>
        <dd><span class="status status--accepted"><span data-icon="statusAccepted"></span>Successfully created</span></dd>
      `;
      hydrateIcons(document.getElementById("deployment-params-status"));
      document.querySelector('#deployment-params-card .info-card__header--actions a[href^="edit-integrations.html"]')?.remove();
      showFlash(flashRoot, { type: "success", message: "Deployment parameters integration was created successfully.", autoDismiss: 4000 });
    }
  }

  const selectedAdminIds = new Set();
  const selectAllAdmins = document.getElementById("select-all-admins");
  const removeAdminBtn = document.getElementById("remove-admin-btn");

  const table = new DataTable({
    root: document.getElementById("procurement-insights-card"),
    data: DELEGATED_ADMINS,
    pageSize: 10,
    colspan: 5,
    emptyHtml: `<div class="empty-state">No delegated administrators</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => selectedAdminIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" ${selectedAdminIds.has(row.id) ? "checked" : ""} /></td>
        <td>${escapeHtml(row.accountId)}</td>
        <td>${statusHtml("accepted", "Active")}</td>
        <td>${escapeHtml(row.email)}</td>
        <td>${escapeHtml(row.dateAdded)}</td>
      </tr>
    `,
    selectedCountFn: () => selectedAdminIds.size,
    onRender: (visible) => {
      removeAdminBtn.disabled = selectedAdminIds.size === 0;
      updateSelectAllCheckbox(selectAllAdmins, visible.filter((r) => selectedAdminIds.has(r.id)).length, visible.length);
    },
  });
  table.render();

  const tbody = document.querySelector("#delegated-admins-table tbody");
  tbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedAdminIds.add(id);
    else selectedAdminIds.delete(id);
    table.render();
  });

  selectAllAdmins.addEventListener("change", (e) => {
    tbody.querySelectorAll(".row-check").forEach((cb) => {
      const id = cb.getAttribute("data-id");
      if (e.target.checked) selectedAdminIds.add(id);
      else selectedAdminIds.delete(id);
    });
    table.render();
  });

  removeAdminBtn.addEventListener("click", () => {
    if (selectedAdminIds.size === 0) return;
    const remaining = DELEGATED_ADMINS.filter((a) => !selectedAdminIds.has(a.id));
    DELEGATED_ADMINS.length = 0;
    DELEGATED_ADMINS.push(...remaining);
    const count = selectedAdminIds.size;
    selectedAdminIds.clear();
    table.setData(DELEGATED_ADMINS);
    showFlash(flashRoot, { type: "success", message: `${count} administrator(s) removed.`, autoDismiss: 4000 });
  });

  // ---- Register new administrator modal ----
  const registerOverlay = document.getElementById("register-admin-overlay");
  const registerModal = document.getElementById("register-admin-modal");
  const registerInput = document.getElementById("register-admin-input");
  const registerCount = document.getElementById("register-admin-count");
  const registerConfirmBtn = document.getElementById("register-admin-confirm");

  function openRegisterModal() {
    registerInput.value = "";
    registerCount.textContent = "AWS account ID must be 12 digits. Character count: 0/12";
    registerConfirmBtn.disabled = true;
    registerOverlay.classList.add("open");
    registerModal.classList.add("open");
    registerInput.focus();
  }
  function closeRegisterModal() {
    registerOverlay.classList.remove("open");
    registerModal.classList.remove("open");
  }

  document.querySelectorAll("[data-open-register-admin]").forEach((btn) => {
    btn.addEventListener("click", openRegisterModal);
  });
  registerOverlay.addEventListener("click", closeRegisterModal);
  document.getElementById("register-admin-close").addEventListener("click", closeRegisterModal);
  document.getElementById("register-admin-cancel").addEventListener("click", closeRegisterModal);

  registerInput.addEventListener("input", () => {
    registerInput.value = registerInput.value.replace(/\D/g, "").slice(0, 12);
    const len = registerInput.value.length;
    registerCount.textContent = `AWS account ID must be 12 digits. Character count: ${len}/12`;
    registerConfirmBtn.disabled = len !== 12;
  });

  registerConfirmBtn.addEventListener("click", () => {
    const accountId = registerInput.value;
    if (accountId.length !== 12) return;
    const now = new Date();
    DELEGATED_ADMINS.unshift({
      id: `new-${Date.now()}`,
      accountId,
      status: "active",
      email: "newadmin@amazon.com",
      dateAdded: now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }),
      dateAddedSort: now,
    });
    table.setData(DELEGATED_ADMINS);
    closeRegisterModal();
    showFlash(flashRoot, { type: "success", message: `Account ${accountId} was registered as an administrator.`, autoDismiss: 4000 });
  });
});
