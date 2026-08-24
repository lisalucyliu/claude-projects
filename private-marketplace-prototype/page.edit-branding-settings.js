/* Page wiring for edit-branding-settings.html */

document.addEventListener("DOMContentLoaded", () => {
  const id = getExperienceId();
  const experience = findExperience(id) || { id, name: "Experience" };
  const details = getExperienceDetails(id, experience.name);

  mountChrome("experiences", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
    { label: "Experiences", href: "experiences.html" },
    { label: experience.name, href: `experience-details.html?id=${id}` },
    { label: "Edit Branding settings" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Edit Branding settings",
    `<h3>Branding settings</h3><p>Customize the name and description your end users see for this experience on their 'My Private Marketplace' page.</p>`
  );

  document.getElementById("f-brand-name").value = details.brandName;
  document.getElementById("f-brand-description").value = details.brandDescription;

  document.getElementById("cancel-btn").addEventListener("click", () => {
    window.location.href = `experience-details.html?id=${id}`;
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    const brandName = document.getElementById("f-brand-name").value.trim();
    const brandDescription = document.getElementById("f-brand-description").value.trim();
    if (!brandName) {
      showFlash(document.getElementById("flash-root"), { type: "error", message: "Enter a name before continuing.", autoDismiss: 4000 });
      return;
    }
    sessionStorage.setItem(`pmp-edited-branding-${id}`, JSON.stringify({ brandName, brandDescription }));
    window.location.href = `experience-details.html?id=${id}`;
  });
});
