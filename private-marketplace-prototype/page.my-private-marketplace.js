/* Page wiring for my-private-marketplace.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("my-pmp", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Private Marketplace", href: "private-marketplace.html" },
    { label: "My Private Marketplace" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "My Private Marketplace",
    `
    <p>This page tells you about the Private Marketplace that you are being governed by.</p>
    <p>If you are governed by a Private Marketplace (a.k.a. an experience), you will see the branding banner and introduction verbiage for this experience.</p>
    <div class="help-panel__links">
      <a href="#" onclick="return false;">Secondary link</a>
      <a href="#" onclick="return false;">Secondary link</a>
      <a href="#" onclick="return false;">Secondary link</a>
    </div>
    `
  );

  registerHelpTopic(
    "what-is-pmp",
    "What is Private Marketplace?",
    `
    <p>Private Marketplace is a governed catalog layer on top of AWS Marketplace. Your administrators choose which products your organization can procure, and you'll only see and purchase from that approved set here.</p>
    <p>If your account is delegated as an administrator, you can also curate this catalog yourself, review product requests, and customize the branding your organization's users see.</p>
    `
  );

  registerHelpTopic(
    "preview",
    "Preview",
    `
    <p>This badge appears on any AWS Marketplace product listing that your Private Marketplace has approved for purchase, so you can tell at a glance which products you're cleared to buy.</p>
    <p>Products without the badge may still be visible in the catalog, but aren't approved for purchase under your organization's current Private Marketplace settings.</p>
    `
  );
});
