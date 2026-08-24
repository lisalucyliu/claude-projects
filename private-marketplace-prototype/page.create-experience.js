/* Page wiring for create-experience.html — the 5-step "new experience" wizard. */

const WIZARD_STEPS = [
  { n: 1, label: "Step 1", title: "Experience details", subtitle: "Define initial details for your private marketplace experience." },
  { n: 2, label: "Step 2", title: "Choose audience", subtitle: "Choose organizational units and accounts to associate with <experience>." },
  { n: 3, label: "Step 3 – optional", title: "Select AWS Marketplace products", subtitle: "Add or remove 1 or more products to your experience. You can also skip this step and do this later." },
  { n: 4, label: "Step 4 – optional", title: "Configure branding settings", subtitle: "Customize the name and description of your AWS Private Marketplace experience for your end users on their 'My Private Marketplace' page." },
  { n: 5, label: "Step 5", title: "Review and submit", subtitle: "" },
];

const wizardState = {
  currentStep: 1,
  name: "",
  description: "",
  status: "live",
  adminMode: "active",
  softwareRequests: "available",
  tags: [{ key: "", value: "" }],
  selectedOrgIds: new Set(["w-org"]),
  productMethod: "separately",
  selectedProductIds: new Set(),
  bulkExperienceId: null,
  brandName: "",
  brandDescription: "",
};

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("experiences", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "dashboard.html" },
    { label: "Experiences", href: "experiences.html" },
    { label: "Create new Private Marketplace experience" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Create experience",
    `
    <h3>Create experience</h3>
    <p>Walk through the 5 steps to define a new Private Marketplace experience: its internal details, who it governs, which products it contains, how it's branded for end users, and a final review before creating it.</p>
    <div class="help-panel__links">
      <h3>Learn more</h3>
      <a href="https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace.html" target="_blank" rel="noopener">Working with Private Marketplace ${Icons.externalLink}</a>
    </div>
    `
  );

  renderWizardNav();
  showStep(1);
  renderTags();
  renderOrgTree();
  setupProductTables();
  setupBulkTable();

  document.getElementById("wizard-next").addEventListener("click", onNext);
  document.getElementById("wizard-prev").addEventListener("click", onPrev);
  document.getElementById("wizard-cancel").addEventListener("click", () => {
    window.location.href = "experiences.html";
  });

  document.querySelectorAll('input[name="exp-status"]').forEach((r) => r.addEventListener("change", (e) => (wizardState.status = e.target.value)));
  document.querySelectorAll('input[name="admin-mode"]').forEach((r) => r.addEventListener("change", (e) => (wizardState.adminMode = e.target.value)));
  document.querySelectorAll('input[name="software-requests"]').forEach((r) => r.addEventListener("change", (e) => (wizardState.softwareRequests = e.target.value)));

  document.getElementById("add-tag-btn").addEventListener("click", () => {
    wizardState.tags.push({ key: "", value: "" });
    renderTags();
  });

  document.querySelectorAll('input[name="product-method"]').forEach((r) => {
    r.addEventListener("change", (e) => {
      wizardState.productMethod = e.target.value;
      document.getElementById("tile-separately").classList.toggle("selected", e.target.value === "separately");
      document.getElementById("tile-bulk").classList.toggle("selected", e.target.value === "bulk");
      document.getElementById("method-separately").style.display = e.target.value === "separately" ? "" : "none";
      document.getElementById("method-bulk").style.display = e.target.value === "bulk" ? "" : "none";
    });
  });
});

function renderWizardNav() {
  const nav = document.getElementById("wizard-nav");
  nav.innerHTML = WIZARD_STEPS.map((step) => {
    const state = step.n < wizardState.currentStep ? "complete" : step.n === wizardState.currentStep ? "active" : "";
    const icon = state === "complete" ? Icons.stepComplete : state === "active" ? Icons.stepActive : Icons.stepIncomplete;
    return `
      <div class="wizard-nav__step ${state}">
        <span class="wizard-nav__icon">${icon}</span>
        <div>
          <div class="wizard-nav__label">${step.label}</div>
          <div class="wizard-nav__title">${step.title}</div>
        </div>
      </div>
    `;
  }).join("");
}

function showStep(n) {
  wizardState.currentStep = n;
  document.querySelectorAll(".wizard-panel").forEach((p) => p.classList.toggle("active", p.getAttribute("data-step") === String(n)));
  const step = WIZARD_STEPS[n - 1];
  document.getElementById("wizard-title").textContent = step.title;
  document.getElementById("wizard-subtitle").textContent = step.subtitle;
  document.getElementById("wizard-subtitle").style.display = step.subtitle ? "" : "none";
  document.getElementById("wizard-prev").style.display = n === 1 ? "none" : "";
  document.getElementById("wizard-next").textContent = n === 5 ? "Create" : "Next";
  if (n === 5) renderReview();
  renderWizardNav();
  window.scrollTo(0, 0);
}

function onNext() {
  if (wizardState.currentStep === 1) {
    wizardState.name = document.getElementById("f-name").value.trim();
    wizardState.description = document.getElementById("f-description").value.trim();
    if (!wizardState.name) {
      showFlash(document.getElementById("flash-root"), { type: "error", message: "Enter a name for this experience before continuing.", autoDismiss: 4000 });
      return;
    }
  }
  if (wizardState.currentStep === 4) {
    wizardState.brandName = document.getElementById("f-brand-name").value.trim();
    wizardState.brandDescription = document.getElementById("f-brand-description").value.trim();
  }
  if (wizardState.currentStep === 5) {
    createExperience();
    return;
  }
  showStep(wizardState.currentStep + 1);
}

function onPrev() {
  showStep(Math.max(1, wizardState.currentStep - 1));
}

function createExperience() {
  const newExperience = {
    id: `exp-new-${Date.now()}`,
    name: wizardState.name,
    status: wizardState.status,
    statusLabel: wizardState.status === "live" ? "Live" : "Not live",
    lastModified: "Just now",
  };
  // Each page load re-parses data.experiences.js from scratch, so the new
  // row can't ride along in memory across navigation — hand it off via
  // sessionStorage instead, and have experiences.html merge it in on load.
  sessionStorage.setItem("pmp-created-experience", JSON.stringify(newExperience));
  window.location.href = "experiences.html";
}

/* ---- Step 1: Tags ---- */
function renderTags() {
  const list = document.getElementById("tags-list");
  list.innerHTML = wizardState.tags
    .map(
      (tag, i) => `
      <div class="form-field-row" style="margin-bottom:12px;align-items:flex-end;">
        <div class="form-field" style="margin-bottom:0;">
          ${i === 0 ? '<label>Key</label>' : ""}
          <div class="search-input"><span data-icon="search"></span><input type="text" placeholder="Enter value" data-tag-key="${i}" value="${escapeHtml(tag.key)}" /></div>
        </div>
        <div class="form-field" style="margin-bottom:0;">
          ${i === 0 ? '<label>Value</label>' : ""}
          <div class="search-input"><span data-icon="search"></span><input type="text" placeholder="Enter value" data-tag-value="${i}" value="${escapeHtml(tag.value)}" /></div>
        </div>
        <button class="btn btn-normal" data-remove-tag="${i}" style="flex-shrink:0;">Remove</button>
      </div>
    `
    )
    .join("");

  list.querySelectorAll("[data-tag-key]").forEach((el) => el.addEventListener("input", (e) => (wizardState.tags[+e.target.dataset.tagKey].key = e.target.value)));
  list.querySelectorAll("[data-tag-value]").forEach((el) => el.addEventListener("input", (e) => (wizardState.tags[+e.target.dataset.tagValue].value = e.target.value)));
  list.querySelectorAll("[data-remove-tag]").forEach((el) =>
    el.addEventListener("click", () => {
      wizardState.tags.splice(+el.dataset.removeTag, 1);
      if (wizardState.tags.length === 0) wizardState.tags.push({ key: "", value: "" });
      renderTags();
    })
  );
  document.getElementById("tags-remaining").textContent = `You can add up to ${50 - wizardState.tags.length} more tags.`;
}

/* ---- Step 2: Org tree (single-select-style checkbox tree) ---- */
function renderOrgTree() {
  const tbody = document.getElementById("w-org-tbody");
  function isVisible(node) {
    let current = node;
    while (current.parentId) {
      const parent = WIZARD_ORG_NODES.find((n) => n.id === current.parentId);
      if (!parent || !parent.expanded) return false;
      current = parent;
    }
    return true;
  }
  function draw() {
    const rows = WIZARD_ORG_NODES.filter(isVisible);
    document.getElementById("w-org-count").textContent = `(${wizardState.selectedOrgIds.size}/${WIZARD_ORG_NODES.length}+)`;
    tbody.innerHTML = rows
      .map((node) => {
        const checked = wizardState.selectedOrgIds.has(node.id);
        const disabled = node.relationship === "Inherited" && !checked;
        const icon = Icons.folder;
        const toggle = node.hasChildren
          ? `<button class="tree-toggle${node.expanded ? " expanded" : ""}" data-w-toggle="${node.id}">${Icons.treeToggle}</button>`
          : `<span class="tree-toggle-spacer"></span>`;
        return `
          <tr data-row-id="${node.id}" class="${checked ? "selected" : ""}">
            <td class="checkbox-col"><input type="checkbox" class="row-check" data-w-id="${node.id}" ${disabled ? "disabled" : ""} ${checked ? "checked" : ""} /></td>
            <td style="padding-left:${2 + node.depth * 20}px;"><div class="tree-cell">${toggle}<span class="tree-icon">${icon}</span><a href="#" onclick="return false;">${escapeHtml(node.name)}</a></div></td>
            <td>${node.accountId}</td>
            <td><a href="#" onclick="return false;">${escapeHtml(node.experience)} ${Icons.externalLink}</a></td>
            <td>${node.relationship}</td>
          </tr>
        `;
      })
      .join("");
  }
  tbody.addEventListener("click", (e) => {
    const t = e.target.closest("[data-w-toggle]");
    if (t) {
      const node = WIZARD_ORG_NODES.find((n) => n.id === t.getAttribute("data-w-toggle"));
      node.expanded = !node.expanded;
      draw();
    }
  });
  tbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-w-id");
    if (e.target.checked) wizardState.selectedOrgIds.add(id);
    else wizardState.selectedOrgIds.delete(id);
    draw();
  });
  draw();
}

/* ---- Step 3: product tables ---- */
let allProductsTable, selectedProductsTable, bulkTable;

function setupProductTables() {
  allProductsTable = new DataTable({
    root: document.getElementById("all-products-root"),
    data: WIZARD_ALL_PRODUCTS,
    pageSize: 5,
    searchFields: ["product", "vendor"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No products available</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => wizardState.selectedProductIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-p-id="${row.id}" ${wizardState.selectedProductIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.vendor)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.approvedIn)}</a></td>
      </tr>
    `,
  });
  allProductsTable.render();

  selectedProductsTable = new DataTable({
    root: document.getElementById("selected-products-root"),
    data: [],
    pageSize: 5,
    searchFields: ["product"],
    colspan: 4,
    emptyHtml: `<div class="empty-state">No products selected yet</div>`,
    rowHtml: (row) => `
      <tr data-row-id="${row.id}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-sp-id="${row.id}" /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)}</a></td>
        <td><a href="#" onclick="return false;">${escapeHtml(row.vendor)}</a></td>
        <td><a href="#" onclick="return false;">${escapeHtml(row.approvedIn)}</a></td>
      </tr>
    `,
  });
  refreshSelectedProducts();

  document.querySelector("#w-all-products-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-p-id");
    if (e.target.checked) wizardState.selectedProductIds.add(id);
    else wizardState.selectedProductIds.delete(id);
    allProductsTable.render();
    refreshSelectedProducts();
  });

  document.getElementById("select-all-products-btn").addEventListener("click", () => {
    WIZARD_ALL_PRODUCTS.forEach((p) => wizardState.selectedProductIds.add(p.id));
    allProductsTable.render();
    refreshSelectedProducts();
  });

  document.getElementById("remove-selected-products-btn").addEventListener("click", () => {
    document.querySelectorAll("#w-selected-products-table .row-check:checked").forEach((cb) => {
      wizardState.selectedProductIds.delete(cb.getAttribute("data-sp-id"));
    });
    allProductsTable.render();
    refreshSelectedProducts();
  });
}

function refreshSelectedProducts() {
  const selected = WIZARD_ALL_PRODUCTS.filter((p) => wizardState.selectedProductIds.has(p.id));
  selectedProductsTable.setData(selected);
}

function setupBulkTable() {
  bulkTable = new DataTable({
    root: document.getElementById("bulk-root"),
    data: WIZARD_BULK_EXPERIENCES,
    pageSize: 5,
    searchFields: ["name"],
    countUsesTotal: true,
    colspan: 3,
    emptyHtml: `<div class="empty-state">No experiences available</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => wizardState.bulkExperienceId === r.id)}">
        <td class="radio-col"><input type="radio" name="bulk-exp" data-b-id="${row.id}" ${wizardState.bulkExperienceId === row.id ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
      </tr>
    `,
  });
  bulkTable.render();

  document.querySelector("#w-bulk-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches('input[name="bulk-exp"]')) return;
    wizardState.bulkExperienceId = e.target.getAttribute("data-b-id");
    bulkTable.render();
  });
}

/* ---- Step 5: review ---- */
function renderReview() {
  const selectedProducts = WIZARD_ALL_PRODUCTS.filter((p) => wizardState.selectedProductIds.has(p.id));
  const selectedOrgCount = wizardState.selectedOrgIds.size;
  const html = `
    <div class="review-section">
      <div class="review-section__header"><h3>Step 1: Experience details</h3><button class="btn btn-normal" data-edit-step="1">Edit</button></div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Private marketplace experience details</h3>
        <dl><dt>Name</dt><dd>${escapeHtml(wizardState.name || "(not set)")}</dd><dt>Description</dt><dd>${escapeHtml(wizardState.description || "—")}</dd></dl>
      </div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Status and requests</h3>
        <dl>
          <dt>Experience mode</dt><dd>${statusHtml("live", wizardState.status === "live" ? "Success" : "Not live")}</dd>
          <dt>Admin mode</dt><dd>${statusHtml("live", wizardState.adminMode === "active" ? "Active experience" : "Archived experience")}</dd>
          <dt>Product requests</dt><dd>${statusHtml("live", wizardState.softwareRequests === "available" ? "On" : "Off")}</dd>
        </dl>
      </div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Tags (${wizardState.tags.filter((t) => t.key).length})</h3>
        <table class="data-table"><thead><tr><th class="no-sort">Key</th><th class="no-sort">Value</th></tr></thead>
        <tbody>${wizardState.tags.filter((t) => t.key).map((t) => `<tr><td>${escapeHtml(t.key)}</td><td>${escapeHtml(t.value)}</td></tr>`).join("") || '<tr><td colspan="2" style="text-align:center;color:var(--color-text-body-tertiary);">No tags added</td></tr>'}</tbody></table>
      </div>
    </div>

    <div class="review-section">
      <div class="review-section__header"><h3>Step 2: Choose audience</h3><button class="btn btn-normal" data-edit-step="2">Edit</button></div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Selected audiences for this experience (${selectedOrgCount})</h3>
        <table class="data-table"><thead><tr><th class="no-sort">Page</th><th class="no-sort">Number of accounts</th></tr></thead>
        <tbody>${[...wizardState.selectedOrgIds].map((id) => { const n = WIZARD_ORG_NODES.find((x) => x.id === id); return n ? `<tr><td>${escapeHtml(n.name)}</td><td>${n.type === "org" ? "1234" : "1"}</td></tr>` : ""; }).join("")}</tbody></table>
      </div>
    </div>

    <div class="review-section">
      <div class="review-section__header"><h3>Step 3: Select AWS Marketplace products</h3><button class="btn btn-normal" data-edit-step="3">Edit</button></div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Add products method</h3>
        <dl><dd>${wizardState.productMethod === "separately" ? "Add products separately" : "Bulk add all products from an existing experience's catalog"}</dd></dl>
      </div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Selected products</h3>
        <table class="data-table"><thead><tr><th class="no-sort">Products</th><th class="no-sort">Vendor</th><th class="no-sort">Approved in</th></tr></thead>
        <tbody>${selectedProducts.map((p) => `<tr><td>${escapeHtml(p.product)}</td><td>${escapeHtml(p.vendor)}</td><td>${escapeHtml(p.approvedIn)}</td></tr>`).join("") || '<tr><td colspan="3" style="text-align:center;color:var(--color-text-body-tertiary);">No products selected</td></tr>'}</tbody></table>
      </div>
    </div>

    <div class="review-section">
      <div class="review-section__header"><h3>Step 4: Configure branding settings</h3><button class="btn btn-normal" data-edit-step="4">Edit</button></div>
      <div class="container review-card">
        <dl><dt>Name</dt><dd>${escapeHtml(wizardState.brandName || "(not set)")}</dd><dt>Description</dt><dd>${escapeHtml(wizardState.brandDescription || "—")}</dd></dl>
      </div>
    </div>
  `;
  const container = document.getElementById("review-content");
  container.innerHTML = html;
  container.querySelectorAll("[data-edit-step]").forEach((btn) => {
    btn.addEventListener("click", () => showStep(Number(btn.getAttribute("data-edit-step"))));
  });
}
