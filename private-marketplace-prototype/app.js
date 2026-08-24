/* Shared interaction behaviors: collapsibles, tabs, dropdowns, help panel, and a generic table. */

function parseDate(str) {
  return new Date(str);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function statusHtml(status, label) {
  const iconMap = {
    pending: Icons.statusPending,
    accepted: Icons.statusAccepted,
    expired: Icons.statusWarning,
    live: Icons.statusAccepted,
    notlive: Icons.statusStopped,
  };
  return `<span class="status status--${status}">${iconMap[status]}${label}</span>`;
}

/* Returns "selected selected--top selected--bottom" (as applicable) for a
   row at `index` within `list`, given `isSelectedFn`. A row only rounds an
   edge that isn't shared with an equally-selected neighbor, so an isolated
   selected row gets full corner radius while a contiguous block of
   selected rows only rounds its outer edges — matching the live Cloudscape
   table exactly. Returns "" when the row itself isn't selected. */
function selectionRowClass(list, index, isSelectedFn) {
  if (!isSelectedFn(list[index])) return "";
  const prevSelected = index > 0 && isSelectedFn(list[index - 1]);
  const nextSelected = index < list.length - 1 && isSelectedFn(list[index + 1]);
  let cls = "selected";
  if (!prevSelected) cls += " selected--top";
  if (!nextSelected) cls += " selected--bottom";
  return cls;
}

/* Syncs a header "select all" checkbox to a partial/full selection, matching
   the live Cloudscape table: checked when every visible row is selected,
   indeterminate (minus glyph) when some but not all are. */
function updateSelectAllCheckbox(el, selectedCount, totalCount) {
  if (!el) return;
  el.checked = totalCount > 0 && selectedCount === totalCount;
  el.indeterminate = selectedCount > 0 && selectedCount < totalCount;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    if (Icons[name]) el.innerHTML = Icons[name];
  });
}

function initCollapsibles() {
  document.querySelectorAll("[data-collapse-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.closest("[data-collapsible]").classList.toggle("collapsed");
    });
  });
}

function initTabs() {
  document.querySelectorAll(".tabs").forEach((tabsEl) => {
    const panelGroup = tabsEl.getAttribute("data-tab-group");
    tabsEl.querySelectorAll(".tab").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        tabsEl.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        tabBtn.classList.add("active");
        const target = tabBtn.getAttribute("data-tab");
        document.querySelectorAll(`.tab-panel[data-tab-group="${panelGroup}"]`).forEach((panel) => {
          panel.classList.toggle("active", panel.getAttribute("data-tab") === target);
        });
      });
    });
  });
}

function initDropdowns() {
  document.querySelectorAll(".btn-dropdown").forEach((wrapper) => {
    const trigger = wrapper.querySelector("[data-dropdown-trigger]");
    const menu = wrapper.querySelector(".dropdown-menu");
    if (!trigger || !menu) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".dropdown-menu.open").forEach((m) => {
        if (m !== menu) m.classList.remove("open");
      });
      menu.classList.toggle("open");
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu.open").forEach((m) => m.classList.remove("open"));
  });
}

function initHelpPanel(title, bodyHtml) {
  const overlay = document.createElement("div");
  overlay.className = "help-panel-overlay";
  const panel = document.createElement("div");
  panel.className = "help-panel";
  panel.innerHTML = `
    <div class="help-panel__header">
      <h2>${title}</h2>
      <button class="help-panel__close" aria-label="Close">${Icons.close}</button>
    </div>
    <div class="help-panel__body">${bodyHtml}</div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  function open() {
    overlay.classList.add("open");
    panel.classList.add("open");
  }
  function close() {
    overlay.classList.remove("open");
    panel.classList.remove("open");
  }

  overlay.addEventListener("click", close);
  panel.querySelector(".help-panel__close").addEventListener("click", close);
  document.querySelectorAll("[data-open-help]").forEach((btn) => {
    btn.addEventListener("click", open);
  });

  return { open, close };
}

/**
 * Generic sortable / searchable / paginated table.
 * options: {
 *   root: element containing toolbar + table + pagination for this panel,
 *   data: array of row objects,
 *   columns: [{ key, sortable }],
 *   pageSize: number,
 *   searchFields: [keys to match against search text],
 *   filterFn: optional (row) => boolean, applied before search,
 *   rowHtml: (row) => html string for <tr>,
 *   emptyHtml: html string shown when zero rows,
 *   onRender: optional callback(visibleRows) after each render (e.g. to rebind row listeners)
 * }
 */
class DataTable {
  constructor(options) {
    this.root = options.root;
    this.data = options.data;
    this.columns = options.columns;
    this.pageSize = options.pageSize || 10;
    this.searchFields = options.searchFields || [];
    this.filterFn = options.filterFn || (() => true);
    this.rowHtml = options.rowHtml;
    this.emptyHtml = options.emptyHtml;
    this.colspan = options.colspan;
    this.onRender = options.onRender;
    this.countLabel = options.countLabel;
    this.countUsesTotal = options.countUsesTotal || false;
    this.selectedCountFn = options.selectedCountFn;

    this.searchText = "";
    this.sortKey = null;
    this.sortDir = 1;
    this.page = 1;

    this.tbody = this.root.querySelector("tbody");
    this.countEl = this.root.querySelector("[data-count]");
    this.paginationEl = this.root.querySelector("[data-pagination]");
    this.searchInput = this.root.querySelector("[data-search-input]");

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchText = e.target.value.trim().toLowerCase();
        this.page = 1;
        this.render();
      });
    }

    this.root.querySelectorAll("[data-sort-key]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.getAttribute("data-sort-key");
        if (this.sortKey === key) {
          this.sortDir *= -1;
        } else {
          this.sortKey = key;
          this.sortDir = 1;
        }
        this.updateSortIndicators();
        this.render();
      });
    });

    this.updateSortIndicators();
  }

  updateSortIndicators() {
    this.root.querySelectorAll("[data-sort-key]").forEach((th) => {
      const key = th.getAttribute("data-sort-key");
      const iconEl = th.querySelector(".sort-icon");
      th.classList.toggle("sorted", key === this.sortKey);
      if (iconEl) {
        if (key !== this.sortKey) {
          iconEl.innerHTML = Icons.sortNeutral;
        } else {
          iconEl.innerHTML = this.sortDir === 1 ? Icons.sortAsc : Icons.sortDesc;
        }
      }
    });
  }

  getFiltered() {
    let rows = this.data.filter(this.filterFn);
    if (this.searchText) {
      rows = rows.filter((row) =>
        this.searchFields.some((field) => String(row[field] ?? "").toLowerCase().includes(this.searchText))
      );
    }
    if (this.sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[this.sortKey];
        const bv = b[this.sortKey];
        if (av instanceof Date && bv instanceof Date) return (av - bv) * this.sortDir;
        return String(av).localeCompare(String(bv), undefined, { numeric: true }) * this.sortDir;
      });
    }
    return rows;
  }

  render() {
    const filtered = this.getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    this.page = Math.min(this.page, totalPages);
    const start = (this.page - 1) * this.pageSize;
    const visible = filtered.slice(start, start + this.pageSize);

    if (this.countEl) {
      const countValue = this.countUsesTotal ? this.data.length : filtered.length;
      if (this.countLabel) {
        this.countEl.textContent = this.countLabel(countValue);
      } else {
        const selectedCount = this.selectedCountFn ? this.selectedCountFn() : 0;
        this.countEl.textContent = selectedCount > 0 ? `(${selectedCount}/${countValue})` : `(${countValue})`;
      }
    }

    if (visible.length === 0) {
      this.tbody.innerHTML = `<tr class="empty-row"><td colspan="${this.colspan}">${this.emptyHtml}</td></tr>`;
    } else {
      this.tbody.innerHTML = visible.map((row, i) => this.rowHtml(row, i, visible)).join("");
    }

    this.renderPagination(totalPages);
    if (this.onRender) this.onRender(visible);
  }

  renderPagination(totalPages) {
    if (!this.paginationEl) return;
    let buttons = `<button class="page-btn" data-page="prev" ${this.page === 1 ? "disabled" : ""}>${Icons.chevronLeft}</button>`;
    for (let p = 1; p <= totalPages; p++) {
      buttons += `<button class="page-btn${p === this.page ? " current" : ""}" data-page="${p}">${p}</button>`;
    }
    buttons += `<button class="page-btn" data-page="next" ${this.page === totalPages ? "disabled" : ""}>${Icons.chevronRight}</button>`;
    this.paginationEl.innerHTML = buttons;
    this.paginationEl.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-page");
        if (val === "prev") this.page = Math.max(1, this.page - 1);
        else if (val === "next") this.page = Math.min(totalPages, this.page + 1);
        else this.page = Number(val);
        this.render();
      });
    });
  }

  setData(data) {
    this.data = data;
    this.page = 1;
    this.render();
  }

  refresh() {
    this.render();
  }
}

const FLASH_ICONS = {
  info: Icons.flashInfo,
  success: Icons.flashSuccess,
  error: Icons.flashError,
  warning: Icons.flashWarning,
  "in-progress": `<span class="spin">${Icons.statusProcessing}</span>`,
};

function showFlash(containerEl, { type = "info", message, autoDismiss = 0, action = null }) {
  const flash = document.createElement("div");
  flash.className = `flash flash--${type}`;
  const actionHtml = action ? `<button class="flash__action">${action.label}</button>` : "";
  flash.innerHTML = `${FLASH_ICONS[type] || FLASH_ICONS.info}<div class="flash__content">${message}</div>${actionHtml}<button class="flash__dismiss">${Icons.flashDismiss}</button>`;
  containerEl.prepend(flash);
  flash.querySelector(".flash__dismiss").addEventListener("click", () => flash.remove());
  if (action) {
    flash.querySelector(".flash__action").addEventListener("click", action.onClick);
  }
  if (autoDismiss) {
    setTimeout(() => flash.remove(), autoDismiss);
  }
  return flash;
}

/* ---- Table preferences modal (cloudscape.design/components/collection-preferences/) ----
   One modal is shared by every gear-icon trigger on the page; wireTablePreferences()
   just tells it which DataTable + <table> element to act on when opened. */
let _prefsModal = null;

function ensurePrefsModal() {
  if (_prefsModal) return _prefsModal;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  const modal = document.createElement("div");
  modal.className = "prefs-modal";
  modal.innerHTML = `
    <div class="prefs-modal__header">
      <h2>Preferences</h2>
      <button class="help-panel__close" id="prefs-close" aria-label="Close">${Icons.close}</button>
    </div>
    <div class="prefs-modal__body">
      <div class="prefs-modal__col">
        <h3>Page size</h3>
        <div class="form-radio-group" id="prefs-page-size-group"></div>
        <label class="prefs-checkbox"><input type="checkbox" id="prefs-wrap-lines" /><div><div class="prefs-checkbox__title">Wrap lines</div><div class="prefs-checkbox__desc">Select to see all the text and wrap the lines</div></div></label>
        <label class="prefs-checkbox"><input type="checkbox" id="prefs-striped" /><div><div class="prefs-checkbox__title">Striped rows</div><div class="prefs-checkbox__desc">Select to add alternating shaded rows</div></div></label>
        <label class="prefs-checkbox"><input type="checkbox" id="prefs-compact" /><div><div class="prefs-checkbox__title">Compact mode</div><div class="prefs-checkbox__desc">Select to display content in a denser, more compact mode</div></div></label>
        <label class="prefs-checkbox"><input type="checkbox" id="prefs-fullscreen" /><div><div class="prefs-checkbox__title">Full screen mode</div><div class="prefs-checkbox__desc">Collapse left navigation by default</div></div></label>
      </div>
      <div class="prefs-modal__divider"></div>
      <div class="prefs-modal__col">
        <h3>Column preferences</h3>
        <p class="prefs-modal__hint">Customize the columns visibility and order.</p>
        <div class="search-input"><span data-icon="search"></span><input type="text" placeholder="Filter columns" id="prefs-col-filter" /></div>
        <div id="prefs-col-list"></div>
      </div>
    </div>
    <div class="prefs-modal__footer">
      <button class="link-btn" id="prefs-cancel">Cancel</button>
      <button class="btn btn-primary" id="prefs-confirm">Confirm</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  hydrateIcons(modal);

  let active = null; // { table, tableEl }

  function close() {
    overlay.classList.remove("open");
    modal.classList.remove("open");
  }

  function renderColumnList(filterText = "") {
    const list = modal.querySelector("#prefs-col-list");
    const cols = active.columns.filter((c) => c.label.toLowerCase().includes(filterText.toLowerCase()));
    list.innerHTML = cols
      .map(
        (c) => `
        <label class="prefs-col-row" data-col-index="${c.index}">
          <span class="prefs-col-row__handle">${Icons.dragHandle}</span>
          <span class="prefs-col-row__label">${escapeHtml(c.label)}</span>
          <span class="toggle-switch"><input type="checkbox" data-col-toggle="${c.index}" ${active.hiddenCols.has(c.index) ? "" : "checked"} /><span class="toggle-switch__track"></span></span>
        </label>
      `
      )
      .join("");
    list.querySelectorAll("[data-col-toggle]").forEach((input) => {
      input.addEventListener("change", (e) => {
        const idx = Number(e.target.getAttribute("data-col-toggle"));
        if (e.target.checked) active.hiddenCols.delete(idx);
        else active.hiddenCols.add(idx);
      });
    });
  }

  modal.querySelector("#prefs-col-filter").addEventListener("input", (e) => renderColumnList(e.target.value));

  overlay.addEventListener("click", close);
  modal.querySelector("#prefs-close").addEventListener("click", close);
  modal.querySelector("#prefs-cancel").addEventListener("click", close);

  modal.querySelector("#prefs-confirm").addEventListener("click", () => {
    if (!active) return close();
    const { table, tableEl } = active;
    const pageSize = Number(modal.querySelector('input[name="prefs-page-size"]:checked').value);
    const wrapLines = modal.querySelector("#prefs-wrap-lines").checked;
    const striped = modal.querySelector("#prefs-striped").checked;
    const compact = modal.querySelector("#prefs-compact").checked;
    const fullScreen = modal.querySelector("#prefs-fullscreen").checked;

    if (table) {
      table.pageSize = pageSize;
      table.page = 1;
    }
    tableEl.classList.toggle("wrap-lines", wrapLines);
    tableEl.classList.toggle("striped", striped);
    tableEl.classList.toggle("compact", compact);
    for (let i = 1; i <= 6; i++) tableEl.classList.toggle(`hide-col-${i}`, active.hiddenCols.has(i));

    const appLayout = document.querySelector(".app-layout");
    const menuToggle = document.getElementById("toolbar-menu-toggle");
    if (appLayout) {
      appLayout.classList.toggle("nav-collapsed", fullScreen);
      if (menuToggle) menuToggle.classList.toggle("is-collapsed", fullScreen);
    }

    if (table) table.render();
    close();
  });

  _prefsModal = {
    open(table, tableEl) {
      const headerCells = Array.from(tableEl.querySelectorAll("thead th")).map((th, i) => ({
        index: i + 1,
        label: th.textContent.trim(),
        th,
      }));
      const columns = headerCells.filter((c) => c.label && !c.th.classList.contains("checkbox-col") && !c.th.classList.contains("radio-col"));

      const hiddenCols = new Set();
      for (let i = 1; i <= 6; i++) if (tableEl.classList.contains(`hide-col-${i}`)) hiddenCols.add(i);

      active = { table, tableEl, columns, hiddenCols };

      const pageSize = table ? table.pageSize : 10;
      modal.querySelector("#prefs-page-size-group").innerHTML = [10, 20]
        .map((n) => `<label class="form-radio"><input type="radio" name="prefs-page-size" value="${n}" ${n === pageSize ? "checked" : ""} /> ${n} resources</label>`)
        .join("");
      modal.querySelector("#prefs-wrap-lines").checked = tableEl.classList.contains("wrap-lines");
      modal.querySelector("#prefs-striped").checked = tableEl.classList.contains("striped");
      modal.querySelector("#prefs-compact").checked = tableEl.classList.contains("compact");
      modal.querySelector("#prefs-fullscreen").checked = document.querySelector(".app-layout")?.classList.contains("nav-collapsed") || false;
      modal.querySelector("#prefs-col-filter").value = "";
      renderColumnList("");

      overlay.classList.add("open");
      modal.classList.add("open");
    },
  };
  return _prefsModal;
}

/* Wires a gear ("Preferences") button to the shared modal for one table.
   `table` may be null for tables that aren't paginated via the DataTable
   class (page size control is hidden from the modal in that case is not
   implemented — pass the DataTable instance whenever one exists). */
function wireTablePreferences(gearBtn, table, tableEl) {
  if (!gearBtn || !tableEl) return;
  gearBtn.addEventListener("click", () => ensurePrefsModal().open(table, tableEl));
}

/* Called explicitly by each page script after mountChrome() injects the
   header/side-nav, so listeners bind to the final DOM exactly once. */
function initSharedUI() {
  initCollapsibles();
  initTabs();
  initDropdowns();
}
