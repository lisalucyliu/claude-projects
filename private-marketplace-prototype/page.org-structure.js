/* Page wiring for organizational-structure.html — hierarchical tree table. */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("org-structure", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "dashboard.html" },
    { label: "Organization structure" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Organization structure",
    `
    <h3>Organization structure</h3>
    <p>View a hierarchy of the organizational units (OUs) and accounts in your AWS Organization, and see which Private Marketplace experience governs each one.</p>
    <h3>Relationship</h3>
    <ul>
      <li><strong>Associated</strong> — this OU or account is directly linked to the experience shown.</li>
      <li><strong>Inherited</strong> — this OU or account governs by inheriting its parent's association.</li>
    </ul>
    <div class="help-panel__links">
      <h3>Learn more</h3>
      <a href="https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-marketplace.html" target="_blank" rel="noopener">Working with Private Marketplace ${Icons.externalLink}</a>
    </div>
    `
  );

  const selectedIds = new Set();
  const tbody = document.getElementById("org-tbody");
  const countEl = document.getElementById("org-count");
  let searchText = "";

  function isVisible(node) {
    let current = node;
    while (current.parentId) {
      const parent = ORG_NODES.find((n) => n.id === current.parentId);
      if (!parent || !parent.expanded) return false;
      current = parent;
    }
    return true;
  }

  function matchesSearch(node) {
    if (!searchText) return true;
    return node.accountId.toLowerCase().includes(searchText) || node.name.toLowerCase().includes(searchText);
  }

  function render() {
    const rows = ORG_NODES.filter((n) => (searchText ? matchesSearch(n) : isVisible(n)));
    countEl.textContent = `(${ORG_NODES.length})`;

    if (rows.length === 0) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="5"><div class="empty-state">No matching organizational units or accounts</div></td></tr>`;
      return;
    }

    tbody.innerHTML = rows
      .map((node, i) => {
        const disabled = node.relationship === "Inherited";
        const icon = node.type === "account" ? Icons.account : Icons.folder;
        const toggle = node.hasChildren
          ? `<button class="tree-toggle${node.expanded ? " expanded" : ""}" data-toggle="${node.id}">${Icons.treeToggle}</button>`
          : `<span class="tree-toggle-spacer"></span>`;
        return `
          <tr data-row-id="${node.id}" class="${selectionRowClass(rows, i, (n) => selectedIds.has(n.id))}">
            <td class="checkbox-col"><input type="checkbox" class="row-check" data-id="${node.id}" ${disabled ? "disabled" : ""} ${selectedIds.has(node.id) ? "checked" : ""} /></td>
            <td style="padding-left:${2 + node.depth * 20}px;">
              <div class="tree-cell">
                ${toggle}
                <span class="tree-icon">${icon}</span>
                <a href="#" onclick="return false;">${escapeHtml(node.name)}</a>
              </div>
            </td>
            <td>${node.accountId}</td>
            <td><a href="#" onclick="return false;">${escapeHtml(node.experience)} ${Icons.externalLink}</a></td>
            <td>${node.relationship}</td>
          </tr>
        `;
      })
      .join("");
  }

  render();

  tbody.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("[data-toggle]");
    if (toggleBtn) {
      const node = ORG_NODES.find((n) => n.id === toggleBtn.getAttribute("data-toggle"));
      node.expanded = !node.expanded;
      render();
    }
  });

  function updateActionsState() {
    const count = selectedIds.size;
    document.querySelector('[data-action="edit"]').disabled = count !== 1;
    document.querySelector('[data-action="remove"]').disabled = count === 0;
  }

  tbody.addEventListener("change", (e) => {
    if (!e.target.matches(".row-check")) return;
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedIds.add(id);
    else selectedIds.delete(id);
    updateActionsState();
    render();
  });

  document.getElementById("select-all-org").addEventListener("change", (e) => {
    ORG_NODES.forEach((n) => {
      if (n.relationship !== "Inherited") {
        if (e.target.checked) selectedIds.add(n.id);
        else selectedIds.delete(n.id);
      }
    });
    updateActionsState();
    render();
  });

  document.querySelector("[data-org-search]").addEventListener("input", (e) => {
    searchText = e.target.value.trim().toLowerCase();
    render();
  });

  document.querySelectorAll(".dropdown-menu [data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const labels = { edit: "Association updated", remove: "Association removed" };
      showFlash(document.getElementById("flash-root"), { type: "success", message: labels[btn.getAttribute("data-action")], autoDismiss: 4000 });
    });
  });

  document.getElementById("create-association-btn").addEventListener("click", () => {
    showFlash(document.getElementById("flash-root"), { type: "success", message: "New association created successfully.", autoDismiss: 4000 });
  });
});
