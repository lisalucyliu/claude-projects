/* Page wiring for fortinet-fortigate.html */

const PDP_USAGE_COSTS = [
  { type: "t2.small", cost: "$0.36" },
  { type: "t3.small", cost: "$0.88" },
  { type: "t3.medium", cost: "$0.88" },
  { type: "t3.xlarge", cost: "$1.02" },
  { type: "c4.large", cost: "$0.88" },
  { type: "c4.xlarge", cost: "$1.02" },
  { type: "c4.2xlarge", cost: "$1.60" },
  { type: "c4.4xlarge", cost: "$3.29" },
  { type: "c4.8xlarge", cost: "$4.10" },
  { type: "c5.large", cost: "$0.88" },
];

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("discover-products", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Security", href: "#" },
    { label: "Amazon Machine Image (AMI)", href: "#" },
    { label: "Fortinet FortiGate Next-Generation Firewall" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Fortinet FortiGate Next-Generation Firewall",
    `
    <p>This page shows everything needed to evaluate and purchase this product: an overview, pricing, legal terms, usage instructions, vendor resources, and support options.</p>
    <p>Products marked "Approved for purchase" have been vetted by your organization's Private Marketplace administrators.</p>
    `
  );

  registerHelpTopic(
    "pricing",
    "Pricing",
    `<p>Usage costs vary by instance type and AWS Region. Select a Region above to see costs specific to that Region. Charges are billed hourly in addition to any underlying AWS infrastructure costs (e.g. EBS storage).</p>`
  );

  registerHelpTopic(
    "usage",
    "Usage information",
    `<p>Shows how this product is delivered (e.g. as an Amazon Machine Image) and how to configure it once launched. Select a version above to see delivery and usage details specific to that version.</p>`
  );

  registerHelpTopic(
    "delivery-details",
    "Delivery details",
    `<p>Describes the AWS resource type this product is delivered as. An Amazon Machine Image (AMI) is a template used to launch an EC2 instance pre-configured with this product's software.</p>`
  );

  // "Show more" toggles: this demo only has the same text the vendor
  // provided (no separately-authored expanded copy to reveal), so the
  // toggle just flips its own label to signal the interaction without
  // fabricating additional vendor content.
  [
    { btn: "pdp-header-show-more" },
    { btn: "pdp-overview-show-more" },
  ].forEach(({ btn }) => {
    const el = document.getElementById(btn);
    el.addEventListener("click", () => {
      el.textContent = el.textContent === "Show more" ? "Show less" : "Show more";
    });
  });

  // ---- Usage costs table (static demo data — no real pagination/search wiring) ----
  document.getElementById("pdp-usage-costs-body").innerHTML = PDP_USAGE_COSTS.map(
    (row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.cost)}</td></tr>`
  ).join("");

  const paginationEl = document.querySelector("#pricing [data-pagination]");
  paginationEl.innerHTML = `
    <button class="page-btn" data-page="prev" disabled>${Icons.chevronLeft}</button>
    <button class="page-btn current" data-page="1">1</button>
    <button class="page-btn" data-page="2">2</button>
    <button class="page-btn" data-page="3">3</button>
    <button class="page-btn" data-page="next">${Icons.chevronRight}</button>
  `;
});
