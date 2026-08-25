/* Page wiring for subscribe.html */

const SUBSCRIBE_USAGE_COSTS = [
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
    { label: "Fortinet FortiGate Next-Generation Firewall", href: "fortinet-fortigate.html" },
    { label: "Subscribe to Fortinet FortiGate Next-Generation Firewall" },
  ]);
  hydrateIcons();
  initSharedUI();

  initHelpPanel(
    "Subscribe to Fortinet FortiGate Next-Generation Firewall",
    `<p>Review the offer, pricing, and terms for this product, then subscribe to create your subscription.</p>`
  );

  registerHelpTopic("offer-details", "Offer details", `<p>An offer defines the terms and pricing your subscription will use. Some products have multiple offers available — for example, a public offer alongside a private offer negotiated directly with the vendor.</p>`);
  registerHelpTopic("available-offers", "Available offers", `<p>Every offer currently available to your account for this product, including any private offers extended to you directly by the vendor.</p>`);
  registerHelpTopic("offer-summary", "Offer summary", `<p>Key identifying details for the offer you've selected, including who extended it and when it expires.</p>`);
  registerHelpTopic("free-trial-details", "Free trial details", `<p>This offer includes a free trial period. Usage during the trial isn't charged; usage-based pricing applies automatically once the trial ends unless you cancel first.</p>`);
  registerHelpTopic("pricing-details", "Pricing details", `<p>Estimated costs for this product based on your selected Region. Actual charges depend on your usage.</p>`);
  registerHelpTopic("usage-cost", "Usage cost", `<p>Hourly cost by instance type in the selected Region. Select a different Region above to see costs specific to that Region.</p>`);
  registerHelpTopic("terms", "Terms and conditions", `<p>You must agree to the vendor's End User License Agreement (EULA) and the AWS Customer Agreement before subscribing. Download the EULA to review it in full.</p>`);
  registerHelpTopic("po-number", "Purchase order (PO) number", `<p>Optionally assign a purchase order number to this subscription so charges appear against it on your invoices.</p>`);
  registerHelpTopic("purchase-details", "Purchase details", `<p>A summary of what you're agreeing to purchase, including the offer, total contract price, and any applicable taxes.</p>`);

  document.getElementById("procure-usage-costs-body").innerHTML = SUBSCRIBE_USAGE_COSTS.map(
    (row) => `<tr><td><span class="dotted-underline">${escapeHtml(row.type)}</span></td><td>${escapeHtml(row.cost)}</td></tr>`
  ).join("");

  const paginationEl = document.querySelector("#pricing-details [data-pagination]");
  paginationEl.innerHTML = `
    <button class="page-btn" data-page="prev" disabled>${Icons.chevronLeft}</button>
    <button class="page-btn current" data-page="1">1</button>
    <button class="page-btn" data-page="2">2</button>
    <button class="page-btn" data-page="3">3</button>
    <button class="page-btn" data-page="next">${Icons.chevronRight}</button>
  `;

  document.getElementById("subscribe-btn").addEventListener("click", () => {
    sessionStorage.setItem("pmp-subscribe-success", "Fortinet FortiGate Next-Generation Firewall");
    window.location.href = "discover-products.html";
  });
});
