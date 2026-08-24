/* Page wiring for bulk-update-products.html — the 3-step "bulk update products" wizard. */

const BULK_STEPS = [
  { n: 1, label: "Step 1", title: "Select AWS Marketplace products" },
  { n: 2, label: "Step 2", title: "Select experiences" },
  { n: 3, label: "Step 3", title: "Review" },
];

const STEP_SUBTITLES = {
  1: `Search for and select 1 or more AWS products to add to 1 or more experiences. Alternatively, you can <a href="experiences.html">view individual experiences</a> to add or remove from individual experiences.`,
  2: `Search for and select 1 or more AWS experiences to add your previously selected product(s).`,
  3: ``,
};

const HELP_CONTENT = {
  1: {
    title: "Bulk update products - Select AWS Marketplace products",
    body: `
      <p>Use this workflow to update multiple products to multiple experiences in three simple steps.</p>
      <p>Choose to add or remove before proceeding.</p>
      <h3>Select AWS Marketplace products</h3>
      <p>Use the search bar to find the desired product(s) from the list of all existing AWS Marketplace products.</p>
      <p>Select 1 or more products to update, which will populate the 'Selected products' table.</p>
      <div class="help-panel__links">
        <h3>Learn more&nbsp;${Icons.externalLink}</h3>
        <a href="#" onclick="return false;">Adding products to a private marketplace</a>
      </div>
    `,
  },
  2: {
    title: "Bulk update products - Select experiences",
    body: `
      <p>Use this workflow to update multiple products to multiple experiences in three simple steps.</p>
      <h3>Select experiences</h3>
      <p>Use the search bar to find the desired experience(s) from the list of all available experiences.</p>
      <p>Select 1 or more experiences to update, which will populate the 'Selected experiences' table.</p>
      <div class="help-panel__links">
        <h3>Learn more&nbsp;${Icons.externalLink}</h3>
        <a href="#" onclick="return false;">Adding products to a private marketplace</a>
        <a href="create-experience.html">Creating a private marketplace experience</a>
      </div>
    `,
  },
  3: {
    title: "Bulk update products - Review",
    body: `
      <p>Use this workflow to update multiple products to multiple experiences in three simple steps.</p>
      <p>If any selections are incorrect, use 'Edit' in the specific step section to go back to the corresponding step page to make any corrections.</p>
      <div class="help-panel__links">
        <h3>Learn more&nbsp;${Icons.externalLink}</h3>
        <a href="#" onclick="return false;">Adding products to a private marketplace</a>
        <a href="create-experience.html">Creating a private marketplace experience</a>
      </div>
    `,
  },
};

const bulkState = {
  currentStep: 1,
  updateMethod: "add",
  selectedProductIds: new Set(),
  selectedExperienceIds: new Set(),
};

let allProductsTable, selectedProductsTable, allExperiencesTable, selectedExperiencesTable;
let removeSelectedProductIds = new Set();
let removeSelectedExperienceIds = new Set();
let step2ValidationShown = false;

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("dashboard", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "dashboard.html" },
    { label: "Dashboard", href: "dashboard.html" },
    { label: "Bulk update products" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(HELP_CONTENT[1].title, HELP_CONTENT[1].body);

  renderWizardNav();
  showStep(1);
  setupProductTables();
  setupExperienceTables();

  document.querySelectorAll('input[name="update-method"]').forEach((r) => {
    r.addEventListener("change", (e) => {
      bulkState.updateMethod = e.target.value;
      document.getElementById("tile-add").classList.toggle("selected", e.target.value === "add");
      document.getElementById("tile-remove").classList.toggle("selected", e.target.value === "remove");
    });
  });

  document.getElementById("wizard-next").addEventListener("click", onNext);
  document.getElementById("wizard-prev").addEventListener("click", onPrev);
  document.getElementById("wizard-cancel").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
});

function renderWizardNav() {
  const nav = document.getElementById("wizard-nav");
  nav.innerHTML = BULK_STEPS.map((step, i) => {
    const state = step.n < bulkState.currentStep ? "complete" : step.n === bulkState.currentStep ? "active" : "";
    const isLast = i === BULK_STEPS.length - 1;
    return `
      <div class="wizard-nav__step ${state}">
        <div class="wizard-nav__rail">
          <div class="wizard-nav__circle"></div>
          ${isLast ? "" : '<div class="wizard-nav__connector"></div>'}
        </div>
        <div class="wizard-nav__text">
          <div class="wizard-nav__label">${step.label}</div>
          <div class="wizard-nav__title">${step.title}</div>
        </div>
      </div>
    `;
  }).join("");
}

function updateHelpPanel(step) {
  const h2 = document.querySelector(".help-panel__header h2");
  const body = document.querySelector(".help-panel__body");
  if (!h2 || !body) return;
  h2.textContent = HELP_CONTENT[step].title;
  body.innerHTML = HELP_CONTENT[step].body;
  hydrateIcons(body);
}

function showStep(n) {
  bulkState.currentStep = n;
  document.querySelectorAll(".wizard-panel").forEach((p) => p.classList.toggle("active", p.getAttribute("data-step") === String(n)));
  const step = BULK_STEPS[n - 1];
  document.getElementById("wizard-title").textContent = step.title;
  const subtitleEl = document.getElementById("wizard-subtitle");
  subtitleEl.innerHTML = STEP_SUBTITLES[n];
  subtitleEl.style.display = STEP_SUBTITLES[n] ? "" : "none";
  document.getElementById("wizard-prev").style.display = n === 1 ? "none" : "";
  document.getElementById("wizard-next").textContent = n === 3 ? "Bulk update products" : "Continue";
  updateHelpPanel(n);
  if (n === 3) renderReview();
  renderWizardNav();
  window.scrollTo(0, 0);
}

function onNext() {
  if (bulkState.currentStep === 2) {
    if (bulkState.selectedExperienceIds.size === 0) {
      showStep2Validation(true);
      return;
    }
    showStep2Validation(false);
    showStep(3);
    return;
  }
  if (bulkState.currentStep === 3) {
    submitBulkUpdate();
    return;
  }
  showStep(bulkState.currentStep + 1);
}

function onPrev() {
  showStep(Math.max(1, bulkState.currentStep - 1));
}

function showStep2Validation(show) {
  step2ValidationShown = show;
  const el = document.getElementById("step2-validation");
  if (show) {
    el.style.display = "";
    el.innerHTML = `<div class="inline-alert inline-alert--error">${Icons.flashError}<span>Select 1 or more experiences to continue.</span></div>`;
  } else {
    el.style.display = "none";
    el.innerHTML = "";
  }
}

function submitBulkUpdate() {
  const result = {
    method: bulkState.updateMethod,
    productCount: bulkState.selectedProductIds.size,
    experienceCount: bulkState.selectedExperienceIds.size,
  };
  sessionStorage.setItem("pmp-bulk-update-result", JSON.stringify(result));
  window.location.href = "dashboard.html";
}

/* ---- Step 1: product tables ---- */
function setupProductTables() {
  const selectAllProducts = document.getElementById("select-all-bulk-products");
  const selectAllSelectedProducts = document.getElementById("select-all-bulk-selected-products");
  const selectAllBtn = document.getElementById("select-all-products-btn");
  const selectAllSelectedBtn = document.getElementById("select-all-selected-products-btn");

  allProductsTable = new DataTable({
    root: document.getElementById("all-products-root"),
    data: WIZARD_ALL_PRODUCTS,
    pageSize: 10,
    searchFields: ["product", "vendor"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No products available</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => bulkState.selectedProductIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-p-id="${row.id}" ${bulkState.selectedProductIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.vendor)}</a></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.approvedIn)}</a></td>
      </tr>
    `,
    selectedCountFn: () => bulkState.selectedProductIds.size,
    onRender: (visible) => {
      updateSelectAllCheckbox(selectAllProducts, visible.filter((r) => bulkState.selectedProductIds.has(r.id)).length, visible.length);
      selectAllBtn.textContent = bulkState.selectedProductIds.size === WIZARD_ALL_PRODUCTS.length ? "Unselect all" : "Select all";
    },
  });
  allProductsTable.render();

  selectedProductsTable = new DataTable({
    root: document.getElementById("selected-products-root"),
    data: [],
    pageSize: 10,
    searchFields: ["product", "vendor"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No products selected yet</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => removeSelectedProductIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-sp-id="${row.id}" ${removeSelectedProductIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.product)}</a></td>
        <td><a href="#" onclick="return false;">${escapeHtml(row.vendor)}</a></td>
        <td><a href="#" onclick="return false;">${escapeHtml(row.approvedIn)}</a></td>
      </tr>
    `,
    onRender: (visible) => {
      document.getElementById("remove-selected-products-btn").disabled = removeSelectedProductIds.size === 0;
      updateSelectAllCheckbox(selectAllSelectedProducts, visible.filter((r) => removeSelectedProductIds.has(r.id)).length, visible.length);
      selectAllSelectedBtn.textContent = removeSelectedProductIds.size > 0 && removeSelectedProductIds.size === bulkState.selectedProductIds.size ? "Unselect all" : "Select all";
    },
  });

  function refreshSelectedProducts() {
    selectedProductsTable.setData(WIZARD_ALL_PRODUCTS.filter((p) => bulkState.selectedProductIds.has(p.id)));
  }
  refreshSelectedProducts();

  document.querySelector("#bulk-all-products-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-p-id");
    if (e.target.checked) bulkState.selectedProductIds.add(id);
    else bulkState.selectedProductIds.delete(id);
    allProductsTable.render();
    refreshSelectedProducts();
  });

  selectAllProducts.addEventListener("change", (e) => {
    document.querySelectorAll("#bulk-all-products-table .row-check").forEach((cb) => {
      const id = cb.getAttribute("data-p-id");
      if (e.target.checked) bulkState.selectedProductIds.add(id);
      else bulkState.selectedProductIds.delete(id);
    });
    allProductsTable.render();
    refreshSelectedProducts();
  });

  document.querySelector("#bulk-selected-products-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-sp-id");
    if (e.target.checked) removeSelectedProductIds.add(id);
    else removeSelectedProductIds.delete(id);
    selectedProductsTable.render();
  });

  selectAllSelectedProducts.addEventListener("change", (e) => {
    document.querySelectorAll("#bulk-selected-products-table .row-check").forEach((cb) => {
      const id = cb.getAttribute("data-sp-id");
      if (e.target.checked) removeSelectedProductIds.add(id);
      else removeSelectedProductIds.delete(id);
    });
    selectedProductsTable.render();
  });

  selectAllBtn.addEventListener("click", () => {
    if (bulkState.selectedProductIds.size === WIZARD_ALL_PRODUCTS.length) bulkState.selectedProductIds.clear();
    else WIZARD_ALL_PRODUCTS.forEach((p) => bulkState.selectedProductIds.add(p.id));
    allProductsTable.render();
    refreshSelectedProducts();
  });

  selectAllSelectedBtn.addEventListener("click", () => {
    const selectedList = WIZARD_ALL_PRODUCTS.filter((p) => bulkState.selectedProductIds.has(p.id));
    if (removeSelectedProductIds.size === selectedList.length && selectedList.length > 0) removeSelectedProductIds.clear();
    else selectedList.forEach((p) => removeSelectedProductIds.add(p.id));
    selectedProductsTable.render();
  });

  document.getElementById("remove-selected-products-btn").addEventListener("click", () => {
    removeSelectedProductIds.forEach((id) => bulkState.selectedProductIds.delete(id));
    removeSelectedProductIds.clear();
    allProductsTable.render();
    refreshSelectedProducts();
  });

  wireTablePreferences(document.querySelector("#all-products-root .page-settings"), allProductsTable, document.getElementById("bulk-all-products-table"));
  wireTablePreferences(document.querySelector("#selected-products-root .page-settings"), selectedProductsTable, document.getElementById("bulk-selected-products-table"));
}

/* ---- Step 2: experience tables ---- */
function setupExperienceTables() {
  const selectAllExp = document.getElementById("select-all-bulk-experiences");
  const selectAllSelectedExp = document.getElementById("select-all-bulk-selected-experiences");
  const selectAllBtn = document.getElementById("select-all-experiences-btn");
  const selectAllSelectedBtn = document.getElementById("select-all-selected-experiences-btn");
  const selectableTotal = BULK_ALL_EXPERIENCES.filter((r) => !r.disabled).length;

  allExperiencesTable = new DataTable({
    root: document.getElementById("all-experiences-root"),
    data: BULK_ALL_EXPERIENCES,
    pageSize: 10,
    searchFields: ["name"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No experiences available</div>`,
    rowHtml: (row, i, list) => {
      const checked = bulkState.selectedExperienceIds.has(row.id);
      const disabled = row.disabled && !checked;
      return `
        <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => bulkState.selectedExperienceIds.has(r.id))}">
          <td class="checkbox-col"><input type="checkbox" class="row-check" data-e-id="${row.id}" ${disabled ? "disabled" : ""} ${checked ? "checked" : ""} /></td>
          <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.name)}</a></td>
          <td>${row.audiences} audience${row.audiences === 1 ? "" : "s"}</td>
          <td>${statusHtml(row.status, row.statusLabel)}</td>
        </tr>
      `;
    },
    selectedCountFn: () => bulkState.selectedExperienceIds.size,
    onRender: (visible) => {
      const selectableVisible = visible.filter((r) => !r.disabled || bulkState.selectedExperienceIds.has(r.id));
      updateSelectAllCheckbox(selectAllExp, selectableVisible.filter((r) => bulkState.selectedExperienceIds.has(r.id)).length, selectableVisible.length);
      selectAllBtn.textContent = bulkState.selectedExperienceIds.size === selectableTotal ? "Unselect all" : "Select all";
      if (bulkState.selectedExperienceIds.size > 0 && step2ValidationShown) showStep2Validation(false);
    },
  });
  allExperiencesTable.render();

  selectedExperiencesTable = new DataTable({
    root: document.getElementById("selected-experiences-root"),
    data: [],
    pageSize: 10,
    searchFields: ["name"],
    countUsesTotal: true,
    colspan: 4,
    emptyHtml: `<div class="empty-state">No selected experiences</div>`,
    rowHtml: (row, i, list) => `
      <tr data-row-id="${row.id}" class="${selectionRowClass(list, i, (r) => removeSelectedExperienceIds.has(r.id))}">
        <td class="checkbox-col"><input type="checkbox" class="row-check" data-se-id="${row.id}" ${removeSelectedExperienceIds.has(row.id) ? "checked" : ""} /></td>
        <td><a href="#" class="truncate" onclick="return false;">${escapeHtml(row.name)}</a></td>
        <td>${row.audiences} audience${row.audiences === 1 ? "" : "s"}</td>
        <td>${statusHtml(row.status, row.statusLabel)}</td>
      </tr>
    `,
    onRender: (visible) => {
      document.getElementById("remove-selected-experiences-btn").disabled = removeSelectedExperienceIds.size === 0;
      updateSelectAllCheckbox(selectAllSelectedExp, visible.filter((r) => removeSelectedExperienceIds.has(r.id)).length, visible.length);
      selectAllSelectedBtn.textContent = removeSelectedExperienceIds.size > 0 && removeSelectedExperienceIds.size === bulkState.selectedExperienceIds.size ? "Unselect all" : "Select all";
    },
  });

  function refreshSelectedExperiences() {
    selectedExperiencesTable.setData(BULK_ALL_EXPERIENCES.filter((e) => bulkState.selectedExperienceIds.has(e.id)));
  }
  refreshSelectedExperiences();

  document.querySelector("#bulk-all-experiences-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-e-id");
    if (e.target.checked) bulkState.selectedExperienceIds.add(id);
    else bulkState.selectedExperienceIds.delete(id);
    allExperiencesTable.render();
    refreshSelectedExperiences();
  });

  selectAllExp.addEventListener("change", (e) => {
    document.querySelectorAll("#bulk-all-experiences-table .row-check:not(:disabled)").forEach((cb) => {
      const id = cb.getAttribute("data-e-id");
      if (e.target.checked) bulkState.selectedExperienceIds.add(id);
      else bulkState.selectedExperienceIds.delete(id);
    });
    allExperiencesTable.render();
    refreshSelectedExperiences();
  });

  document.querySelector("#bulk-selected-experiences-table tbody").addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-se-id");
    if (e.target.checked) removeSelectedExperienceIds.add(id);
    else removeSelectedExperienceIds.delete(id);
    selectedExperiencesTable.render();
  });

  selectAllSelectedExp.addEventListener("change", (e) => {
    document.querySelectorAll("#bulk-selected-experiences-table .row-check").forEach((cb) => {
      const id = cb.getAttribute("data-se-id");
      if (e.target.checked) removeSelectedExperienceIds.add(id);
      else removeSelectedExperienceIds.delete(id);
    });
    selectedExperiencesTable.render();
  });

  selectAllBtn.addEventListener("click", () => {
    if (bulkState.selectedExperienceIds.size === selectableTotal) bulkState.selectedExperienceIds.clear();
    else BULK_ALL_EXPERIENCES.filter((r) => !r.disabled).forEach((r) => bulkState.selectedExperienceIds.add(r.id));
    allExperiencesTable.render();
    refreshSelectedExperiences();
  });

  selectAllSelectedBtn.addEventListener("click", () => {
    const selectedList = BULK_ALL_EXPERIENCES.filter((e) => bulkState.selectedExperienceIds.has(e.id));
    if (removeSelectedExperienceIds.size === selectedList.length && selectedList.length > 0) removeSelectedExperienceIds.clear();
    else selectedList.forEach((e) => removeSelectedExperienceIds.add(e.id));
    selectedExperiencesTable.render();
  });

  document.getElementById("remove-selected-experiences-btn").addEventListener("click", () => {
    removeSelectedExperienceIds.forEach((id) => bulkState.selectedExperienceIds.delete(id));
    removeSelectedExperienceIds.clear();
    allExperiencesTable.render();
    refreshSelectedExperiences();
  });

  wireTablePreferences(document.querySelector("#all-experiences-root .page-settings"), allExperiencesTable, document.getElementById("bulk-all-experiences-table"));
  wireTablePreferences(document.querySelector("#selected-experiences-root .page-settings"), selectedExperiencesTable, document.getElementById("bulk-selected-experiences-table"));
}

/* ---- Step 3: review ---- */
function renderReview() {
  const selectedProducts = WIZARD_ALL_PRODUCTS.filter((p) => bulkState.selectedProductIds.has(p.id));
  const selectedExperiences = BULK_ALL_EXPERIENCES.filter((e) => bulkState.selectedExperienceIds.has(e.id));
  const methodLabel = bulkState.updateMethod === "add" ? "Bulk add products" : "Bulk remove products";
  const html = `
    <div class="review-section">
      <div class="review-section__header"><h3>Step 1: Select AWS Marketplace products</h3><button class="btn btn-normal" data-edit-step="1">Edit</button></div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Bulk update method</h3>
        <dl><dt>Choose add or remove</dt><dd>${methodLabel}</dd></dl>
      </div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Selected products</h3>
        <table class="data-table"><thead><tr><th class="no-sort">Products</th><th class="no-sort">Vendor</th><th class="no-sort">Approved in</th></tr></thead>
        <tbody>${selectedProducts.map((p) => `<tr><td>${escapeHtml(p.product)}</td><td>${escapeHtml(p.vendor)}</td><td>${escapeHtml(p.approvedIn)}</td></tr>`).join("") || '<tr><td colspan="3" style="text-align:center;color:var(--color-text-body-tertiary);">No products selected</td></tr>'}</tbody></table>
      </div>
    </div>

    <div class="review-section">
      <div class="review-section__header"><h3>Step 2: Select experiences</h3><button class="btn btn-normal" data-edit-step="2">Edit</button></div>
      <div class="container review-card">
        <h3 style="margin-top:0;">Selected experiences</h3>
        <table class="data-table"><thead><tr><th class="no-sort">Experiences</th><th class="no-sort"># of audiences</th><th class="no-sort">Status</th></tr></thead>
        <tbody>${selectedExperiences.map((e) => `<tr><td>${escapeHtml(e.name)}</td><td>${e.audiences} audience${e.audiences === 1 ? "" : "s"}</td><td>${statusHtml(e.status, e.statusLabel)}</td></tr>`).join("") || '<tr><td colspan="3" style="text-align:center;color:var(--color-text-body-tertiary);">No experiences selected</td></tr>'}</tbody></table>
      </div>
    </div>
  `;
  const container = document.getElementById("bulk-review-content");
  container.innerHTML = html;
  container.querySelectorAll("[data-edit-step]").forEach((btn) => {
    btn.addEventListener("click", () => showStep(Number(btn.getAttribute("data-edit-step"))));
  });
}
