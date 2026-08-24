/* Page wiring for edit-experience.html — combined edit form for an
   experience's Details, Status and requests, and Tags cards. */

document.addEventListener("DOMContentLoaded", () => {
  const id = getExperienceId();
  const experience = findExperience(id) || { id, name: "Experience", status: "live" };
  const details = getExperienceDetails(id, experience.name);

  mountChrome("experiences", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
    { label: "Experiences", href: "experiences.html" },
    { label: experience.name, href: `experience-details.html?id=${id}` },
    { label: "Edit" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Edit",
    `<h3>Edit experience</h3><p>Update this experience's internal name, description, live status, admin mode, product request setting, and tags.</p>`
  );

  const editState = {
    name: experience.name,
    description: details.description,
    status: experience.status,
    adminMode: "active",
    productRequests: details.productRequests ? "available" : "unavailable",
    tags: details.tags.map((t) => ({ ...t })),
  };

  document.getElementById("f-name").value = editState.name;
  document.getElementById("f-description").value = editState.description;
  document.querySelector(`input[name="exp-status"][value="${editState.status}"]`).checked = true;
  document.querySelector(`input[name="admin-mode"][value="${editState.adminMode}"]`).checked = true;
  document.querySelector(`input[name="product-requests"][value="${editState.productRequests}"]`).checked = true;

  document.querySelectorAll('input[name="exp-status"]').forEach((r) => r.addEventListener("change", (e) => (editState.status = e.target.value)));
  document.querySelectorAll('input[name="admin-mode"]').forEach((r) => r.addEventListener("change", (e) => (editState.adminMode = e.target.value)));
  document.querySelectorAll('input[name="product-requests"]').forEach((r) => r.addEventListener("change", (e) => (editState.productRequests = e.target.value)));

  function renderTags() {
    const list = document.getElementById("tags-list");
    list.innerHTML = editState.tags
      .map(
        (tag, i) => `
        <div class="form-field-row" style="margin-bottom:12px;align-items:flex-end;">
          <div class="form-field" style="margin-bottom:0;">
            ${i === 0 ? "<label>Key</label>" : ""}
            <input type="text" placeholder="Enter value" data-tag-key="${i}" value="${escapeHtml(tag.key)}" />
          </div>
          <div class="form-field" style="margin-bottom:0;">
            ${i === 0 ? "<label>Value</label>" : ""}
            <input type="text" placeholder="Enter value" data-tag-value="${i}" value="${escapeHtml(tag.value)}" />
          </div>
          <button class="btn btn-normal" data-remove-tag="${i}" style="flex-shrink:0;">Remove</button>
        </div>
      `
      )
      .join("");

    list.querySelectorAll("[data-tag-key]").forEach((el) => el.addEventListener("input", (e) => (editState.tags[+e.target.dataset.tagKey].key = e.target.value)));
    list.querySelectorAll("[data-tag-value]").forEach((el) => el.addEventListener("input", (e) => (editState.tags[+e.target.dataset.tagValue].value = e.target.value)));
    list.querySelectorAll("[data-remove-tag]").forEach((el) =>
      el.addEventListener("click", () => {
        editState.tags.splice(+el.dataset.removeTag, 1);
        renderTags();
      })
    );
    document.getElementById("tags-remaining").textContent = `You can add up to ${49 - editState.tags.length} more tags.`;
  }
  renderTags();

  document.getElementById("add-tag-btn").addEventListener("click", () => {
    editState.tags.push({ key: "", value: "" });
    renderTags();
  });

  document.getElementById("cancel-btn").addEventListener("click", () => {
    window.location.href = `experience-details.html?id=${id}`;
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    const name = document.getElementById("f-name").value.trim();
    const description = document.getElementById("f-description").value.trim();
    if (!name) {
      showFlash(document.getElementById("flash-root"), { type: "error", message: "Enter a name for this experience before continuing.", autoDismiss: 4000 });
      return;
    }
    sessionStorage.setItem(
      `pmp-edited-experience-${id}`,
      JSON.stringify({
        name,
        description,
        status: editState.status,
        productRequests: editState.productRequests === "available",
        tags: editState.tags.filter((t) => t.key.trim() || t.value.trim()),
      })
    );
    window.location.href = `experience-details.html?id=${id}`;
  });
});
