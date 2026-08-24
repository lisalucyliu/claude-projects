/* Page wiring for change-details.html — the leaf-level individual-change
   detail page, showing its metadata plus the full raw change payload. */

document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const found = findChange(id);
  const change = found ? found.change : CHANGE_SETS[0].changes[0];
  const changeSet = found ? found.changeSet : CHANGE_SETS[0];

  mountChrome("change-sets", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
    { label: "Change sets", href: "change-sets.html" },
    { label: changeSet.changes.length > 1 ? `${changeSet.changeType} + more` : changeSet.changeType, href: `change-set-details.html?id=${changeSet.id}` },
    { label: change.changeType },
  ]);
  hydrateIcons();
  initSharedUI();
  document.title = `Change details: ${change.changeType} — AWS Marketplace`;
  document.getElementById("change-heading").innerHTML = `Change details: ${change.changeType}`;

  initHelpPanel(
    "Change details",
    `<h3>Change details</h3><p>View the full raw payload of an individual change, including the entity it acted on and, if it failed, the underlying error details.</p>`
  );

  document.getElementById("change-type").textContent = change.changeType;
  document.getElementById("change-entity-id").textContent = change.entityIdentifier;
  document.getElementById("change-status").innerHTML = statusHtml(change.status, change.statusLabel);
  document.getElementById("change-error-code").textContent = change.errorCode || "-";

  const payload = {
    ChangeType: change.changeType,
    Details: JSON.stringify(change.details || {}),
    DetailsDocument: change.details || {},
    Entity: { Identifier: change.entityIdentifier, Type: change.entityType },
  };
  if (change.errorDetailList) payload.ErrorDetailList = change.errorDetailList;

  document.getElementById("change-json").textContent = JSON.stringify(payload, null, 2);
});
