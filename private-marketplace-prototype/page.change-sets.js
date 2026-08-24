/* Page wiring for change-sets.html — an expandable, single-select
   (radio) table of change sets, each of which can expand to show its
   individual changes inline. */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("change-sets", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
    { label: "Change sets" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Change sets",
    `
    <h3>Change sets</h3>
    <p>A change set is a group of one or more changes made in Private Marketplace, such as creating an experience or associating an audience. Track the status of ongoing and past change sets, or drill into an individual change to see its full details.</p>
    <div class="help-panel__links">
      <h3>Learn more&nbsp;${Icons.externalLink}</h3>
      <a href="https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace.html" target="_blank" rel="noopener">Working with Private Marketplace</a>
    </div>
    `
  );

  const tbody = document.getElementById("cs-tbody");
  const countEl = document.getElementById("cs-count");
  const viewDetailsBtn = document.getElementById("view-cs-details-btn");
  let searchText = "";
  let statusFilter = "";
  let selectedId = null; // either a change-set id or an individual change id
  let selectedKind = null; // "set" | "change"

  function matchesFilter(cs) {
    if (statusFilter && cs.status !== statusFilter) return false;
    if (!searchText) return true;
    const haystack = `${cs.id} ${cs.changeType}`.toLowerCase();
    return haystack.includes(searchText);
  }

  function render() {
    const filtered = CHANGE_SETS.filter(matchesFilter);
    countEl.textContent = `(${CHANGE_SETS.length})`;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="7"><div class="empty-state">No matching change sets</div></td></tr>`;
      renderPagination();
      return;
    }

    tbody.innerHTML = filtered
      .map((cs) => {
        const hasMultiple = cs.changes.length > 1;
        const label = hasMultiple ? `${cs.changeType} + more` : cs.changeType;
        const toggle = hasMultiple
          ? `<button class="tree-toggle${cs.expanded ? " expanded" : ""}" data-toggle="${cs.id}">${Icons.treeToggle}</button>`
          : `<span class="tree-toggle-spacer"></span>`;
        const setRow = `
          <tr data-row-id="${cs.id}" class="${selectedKind === "set" && selectedId === cs.id ? "selected selected--top selected--bottom" : ""}">
            <td class="radio-col"><input type="radio" name="cs-radio" class="row-radio" data-kind="set" data-id="${cs.id}" ${selectedKind === "set" && selectedId === cs.id ? "checked" : ""} /></td>
            <td>${toggle}</td>
            <td><a href="change-set-details.html?id=${cs.id}" class="truncate">${label}</a></td>
            <td>${cs.changes.length}</td>
            <td>${statusHtml(cs.status, cs.statusLabel)}</td>
            <td>${cs.startTime}</td>
            <td>${cs.endTime || "-"}</td>
          </tr>
        `;
        if (!hasMultiple || !cs.expanded) return setRow;
        const childRows = cs.changes
          .map(
            (change) => `
          <tr data-row-id="${change.id}" class="${selectedKind === "change" && selectedId === change.id ? "selected selected--top selected--bottom" : ""}">
            <td class="radio-col"><input type="radio" name="cs-radio" class="row-radio" data-kind="change" data-id="${change.id}" ${selectedKind === "change" && selectedId === change.id ? "checked" : ""} /></td>
            <td></td>
            <td style="padding-left:44px;"><a href="change-details.html?id=${change.id}" class="truncate">${change.changeType}</a></td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        `
          )
          .join("");
        return setRow + childRows;
      })
      .join("");

    renderPagination();
  }

  function renderPagination() {
    const el = document.getElementById("cs-pagination");
    el.innerHTML = `<button class="page-btn" disabled>${Icons.chevronLeft}</button><button class="page-btn current">1</button><button class="page-btn" disabled>${Icons.chevronRight}</button>`;
  }

  render();

  tbody.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("[data-toggle]");
    if (toggleBtn) {
      const cs = findChangeSet(toggleBtn.getAttribute("data-toggle"));
      cs.expanded = !cs.expanded;
      render();
    }
  });

  tbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-radio")) return;
    selectedKind = e.target.getAttribute("data-kind");
    selectedId = e.target.getAttribute("data-id");
    viewDetailsBtn.disabled = false;
    render();
  });

  viewDetailsBtn.addEventListener("click", () => {
    if (!selectedId) return;
    if (selectedKind === "set") window.location.href = `change-set-details.html?id=${selectedId}`;
    else window.location.href = `change-details.html?id=${selectedId}`;
  });

  document.getElementById("refresh-cs").addEventListener("click", render);

  document.getElementById("cs-search").addEventListener("input", (e) => {
    searchText = e.target.value.trim().toLowerCase();
    render();
  });

  document.querySelectorAll("#cs-status-filter [data-status-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      statusFilter = btn.getAttribute("data-status-filter");
      const label = statusFilter ? btn.textContent : "Filter by status";
      document.querySelector("#cs-status-filter [data-dropdown-trigger]").innerHTML = `${label} <span data-icon="chevronDownSmall"></span>`;
      hydrateIcons(document.getElementById("cs-status-filter"));
      render();
    });
  });
});
