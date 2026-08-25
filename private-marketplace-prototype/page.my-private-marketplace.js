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
});
