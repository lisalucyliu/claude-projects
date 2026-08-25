/* Page wiring for edit-integrations.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("settings", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Settings", href: "settings.html" },
    { label: "Private Marketplace settings: Integrations" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Private Marketplace settings: Integrations",
    `
    <p>Enable administrator-level permissions for Private Marketplace by creating a service-linked role and/or enabling trusted access for your organization.</p>
    <h3>Service-linked role</h3>
    <p>The service-linked role allows the trusted service to perform the tasks that are described in the trusted services documentation. The trusted service is notified about any changes to your organization and can perform additional tasks in response to those notifications.</p>
    <h3>Trusted access</h3>
    <p>Enabling trusted access designates Private Marketplace as a trusted service in your organization. A trusted service can query the organization's structure and create a service-linked role in the management account of the organization.</p>
    `
  );

  document.getElementById("create-integration-btn").addEventListener("click", () => {
    sessionStorage.setItem("pmp-integration-created", "deployment-params");
    window.location.href = "settings.html";
  });
});
