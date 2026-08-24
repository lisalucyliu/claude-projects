/* Page wiring for experience-details.html — the "Details / Associated
   audience / Products / Branding settings" tabbed detail page reached from
   Experiences > View details. */

document.addEventListener("DOMContentLoaded", () => {
  const id = getExperienceId();
  const experience = findExperience(id) || { id, name: "Experience", status: "live", statusLabel: "Live" };
  const details = getExperienceDetails(id, experience.name);

  // Each page load re-parses the data files from scratch, so edits made on
  // edit-experience.html / edit-branding-settings.html can't ride along in
  // memory — they're handed off via sessionStorage and merged in here.
  let editedFlashMessage = null;
  const editedExpRaw = sessionStorage.getItem(`pmp-edited-experience-${id}`);
  if (editedExpRaw) {
    const edited = JSON.parse(editedExpRaw);
    experience.name = edited.name;
    experience.status = edited.status;
    experience.statusLabel = edited.status === "live" ? "Live" : "Not live";
    details.description = edited.description;
    details.productRequests = edited.productRequests;
    details.tags = edited.tags;
    sessionStorage.removeItem(`pmp-edited-experience-${id}`);
    editedFlashMessage = "Experience details were saved successfully.";
  }
  const editedBrandRaw = sessionStorage.getItem(`pmp-edited-branding-${id}`);
  if (editedBrandRaw) {
    const edited = JSON.parse(editedBrandRaw);
    details.brandName = edited.brandName;
    details.brandDescription = edited.brandDescription;
    sessionStorage.removeItem(`pmp-edited-branding-${id}`);
    editedFlashMessage = "Branding settings were saved successfully.";
  }

  mountChrome("experiences", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
    { label: "Experiences", href: "experiences.html" },
    { label: experience.name },
  ]);
  hydrateIcons();
  initSharedUI();
  document.title = `${experience.name} — AWS Marketplace`;
  document.getElementById("exp-name-heading").textContent = experience.name;

  if (editedFlashMessage) {
    showFlash(document.getElementById("flash-root"), { type: "success", message: editedFlashMessage, autoDismiss: 5000 });
  }

  initHelpPanel(
    experience.name,
    `
    <h3>Experience details</h3>
    <p>View and edit this experience's internal details, the audience it's associated with, the products it manages, and the branding your end users see on their 'My Private Marketplace' page.</p>
    <div class="help-panel__links">
      <h3>Learn more&nbsp;${Icons.externalLink}</h3>
      <a href="https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace.html" target="_blank" rel="noopener">Working with Private Marketplace</a>
    </div>
    `
  );

  // ---- Details tab ----
  document.getElementById("detail-name").textContent = experience.name;
  document.getElementById("detail-id").textContent = details.expId;
  document.getElementById("detail-description").textContent = details.description;
  document.getElementById("detail-owner").textContent = details.ownerAccountId;
  document.getElementById("detail-status").innerHTML = statusHtml(experience.status, experience.statusLabel);
  document.getElementById("detail-admin-mode").textContent = "Active experience";
  document.getElementById("detail-product-requests").textContent = details.productRequests ? "Product requests available" : "Product requests unavailable";

  document.getElementById("detail-tags-count").textContent = `(${details.tags.length})`;
  document.querySelector("#tags-table tbody").innerHTML = details.tags.length
    ? details.tags.map((t) => `<tr><td>${escapeHtml(t.key)}</td><td>${escapeHtml(t.value)}</td></tr>`).join("")
    : `<tr><td colspan="2" style="text-align:center;color:var(--color-text-body-secondary);">No tags</td></tr>`;

  document.getElementById("edit-details-btn").addEventListener("click", () => {
    window.location.href = `edit-experience.html?id=${id}&section=details`;
  });
  document.getElementById("edit-status-btn").addEventListener("click", () => {
    window.location.href = `edit-experience.html?id=${id}&section=status`;
  });
  document.getElementById("edit-tags-btn").addEventListener("click", () => {
    window.location.href = `edit-experience.html?id=${id}&section=tags`;
  });

  // ---- Associated audience tab ----
  const audienceTable = new DataTable({
    root: document.getElementById("audience-panel"),
    data: details.associatedAudience,
    pageSize: 10,
    searchFields: ["name", "accountId"],
    colspan: 4,
    emptyHtml: `<div class="empty-state">No audience associated with this experience</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}">
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${escapeHtml(row.accountId)}</td>
        <td>${row.type === "ou" ? "Organizational unit" : "Account"}</td>
        <td>${row.relationship}</td>
      </tr>
    `,
  });
  audienceTable.render();

  // ---- Products tab ----
  const managedProductIds = new Set(details.managedProductIds);
  const selectedManagedIds = new Set();
  const selectAllManaged = document.getElementById("select-all-managed-products");
  const removeManagedBtn = document.getElementById("remove-managed-products-btn");

  const managedProductsTable = new DataTable({
    root: document.getElementById("managed-products-panel"),
    data: WIZARD_ALL_PRODUCTS.filter((p) => managedProductIds.has(p.id)),
    pageSize: 10,
    searchFields: ["product", "vendor"],
    countUsesTotal: true,
    colspan: 3,
    emptyHtml: `<div class="empty-state">No managed products</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => selectedManagedIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" ${selectedManagedIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.vendor)}</a></td>
      </tr>
    `,
    selectedCountFn: () => selectedManagedIds.size,
    onRender: (visible) => {
      removeManagedBtn.disabled = selectedManagedIds.size === 0;
      updateSelectAllCheckbox(selectAllManaged, visible.filter((r) => selectedManagedIds.has(r.id)).length, visible.length);
    },
  });
  managedProductsTable.render();

  document.querySelector("#managed-products-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedManagedIds.add(id);
    else selectedManagedIds.delete(id);
    managedProductsTable.render();
  });
  selectAllManaged.addEventListener("change", (e) => {
    document.querySelectorAll("#managed-products-table .row-check").forEach((cb) => {
      const id = cb.getAttribute("data-id");
      if (e.target.checked) selectedManagedIds.add(id);
      else selectedManagedIds.delete(id);
    });
    managedProductsTable.render();
  });
  document.getElementById("refresh-managed-products").addEventListener("click", () => managedProductsTable.refresh());
  removeManagedBtn.addEventListener("click", () => {
    selectedManagedIds.forEach((id) => managedProductIds.delete(id));
    const count = selectedManagedIds.size;
    selectedManagedIds.clear();
    managedProductsTable.setData(WIZARD_ALL_PRODUCTS.filter((p) => managedProductIds.has(p.id)));
    allProductsTable.render();
    showFlash(document.getElementById("flash-root"), { type: "success", message: `Removed access for ${count} product${count === 1 ? "" : "s"}.`, autoDismiss: 4000 });
  });

  const selectedAllIds = new Set();
  const selectAllAll = document.getElementById("select-all-all-products");
  const addProductsBtn = document.getElementById("add-products-btn");
  const removeProductsBtn = document.getElementById("remove-products-btn");

  const allProductsTable = new DataTable({
    root: document.getElementById("all-products-panel"),
    data: WIZARD_ALL_PRODUCTS,
    pageSize: 10,
    searchFields: ["product", "vendor"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No products</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => selectedAllIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${row.id}" ${selectedAllIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.vendor)}</a></td>
        <td>${managedProductIds.has(row.id) ? "Managed" : "-"}</td>
      </tr>
    `,
    selectedCountFn: () => selectedAllIds.size,
    onRender: (visible) => {
      addProductsBtn.disabled = selectedAllIds.size === 0;
      removeProductsBtn.disabled = selectedAllIds.size === 0;
      updateSelectAllCheckbox(selectAllAll, visible.filter((r) => selectedAllIds.has(r.id)).length, visible.length);
    },
  });
  allProductsTable.render();

  document.querySelector("#all-products-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedAllIds.add(id);
    else selectedAllIds.delete(id);
    allProductsTable.render();
  });
  selectAllAll.addEventListener("change", (e) => {
    document.querySelectorAll("#all-products-table .row-check").forEach((cb) => {
      const id = cb.getAttribute("data-id");
      if (e.target.checked) selectedAllIds.add(id);
      else selectedAllIds.delete(id);
    });
    allProductsTable.render();
  });
  document.getElementById("refresh-all-products").addEventListener("click", () => allProductsTable.refresh());
  addProductsBtn.addEventListener("click", () => {
    selectedAllIds.forEach((id) => managedProductIds.add(id));
    const count = selectedAllIds.size;
    selectedAllIds.clear();
    managedProductsTable.setData(WIZARD_ALL_PRODUCTS.filter((p) => managedProductIds.has(p.id)));
    allProductsTable.render();
    showFlash(document.getElementById("flash-root"), { type: "success", message: `Added ${count} product${count === 1 ? "" : "s"} to this experience.`, autoDismiss: 4000 });
  });
  removeProductsBtn.addEventListener("click", () => {
    selectedAllIds.forEach((id) => managedProductIds.delete(id));
    const count = selectedAllIds.size;
    selectedAllIds.clear();
    managedProductsTable.setData(WIZARD_ALL_PRODUCTS.filter((p) => managedProductIds.has(p.id)));
    allProductsTable.render();
    showFlash(document.getElementById("flash-root"), { type: "success", message: `Removed ${count} product${count === 1 ? "" : "s"} from this experience.`, autoDismiss: 4000 });
  });

  // ---- Branding settings tab ----
  document.getElementById("detail-brand-name").textContent = details.brandName;
  document.getElementById("detail-brand-description").innerHTML = escapeHtml(details.brandDescription).replace(
    /(https?:\/\/\S+|[\w.+-]+@[\w-]+\.[\w.-]+)/g,
    (m) => `<a href="#" onclick="return false;">${m}</a>`
  );
  document.getElementById("edit-branding-btn").addEventListener("click", () => {
    window.location.href = `edit-branding-settings.html?id=${id}`;
  });
});
