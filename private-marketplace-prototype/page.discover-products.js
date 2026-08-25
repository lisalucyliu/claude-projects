/* Page wiring for discover-products.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("discover-products", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Discover products" },
  ]);
  hydrateIcons();
  initSharedUI();

  const subscribedProduct = sessionStorage.getItem("pmp-subscribe-success");
  if (subscribedProduct) {
    sessionStorage.removeItem("pmp-subscribe-success");
    showFlash(document.getElementById("flash-root"), {
      type: "success",
      message: `You have successfully subscribed to ${escapeHtml(subscribedProduct)}.`,
      autoDismiss: 5000,
    });
  }

  const total = DISCOVER_PRODUCTS.length;
  document.getElementById("discover-count").textContent = `(${total} results)`;
  document.getElementById("discover-showing").textContent = String(total);

  const BADGE_HTML = {
    approved: `<span class="badge badge--pmp">Approved for purchase</span>`,
    "free-trial": `<span class="badge badge--outline">Free Trial</span>`,
  };

  const listEl = document.getElementById("product-list");
  listEl.innerHTML = DISCOVER_PRODUCTS.map((p) => {
    const titleHref = p.href || "#";
    const titleAttrs = p.href ? "" : ` onclick="return false;"`;
    return `
    <div class="product-card">
      <div class="product-card__icon" style="background:${p.iconColor};">${p.iconInitial}</div>
      <div class="product-card__content">
        <a class="product-card__title" href="${titleHref}"${titleAttrs}>${escapeHtml(p.name)}</a>
        <p class="product-card__meta">By <a href="#" onclick="return false;">${escapeHtml(p.publisher)}</a>${p.version ? ` | Ver ${escapeHtml(p.version)}` : ""}</p>
        <div class="product-card__badges">${(p.badges || []).map((b) => BADGE_HTML[b]).join(" ")}</div>
        <p class="product-card__desc">${escapeHtml(p.description)}</p>
      </div>
    </div>
  `;
  }).join("");

  // Single page of results for this demo — pagination is rendered for
  // visual completeness (matching the wireframe) but only ever shows page 1.
  const paginationEl = document.querySelector("[data-pagination]");
  paginationEl.innerHTML = `
    <button class="page-btn" data-page="prev" disabled>${Icons.chevronLeft}</button>
    <button class="page-btn current" data-page="1">1</button>
    <button class="page-btn" data-page="next" disabled>${Icons.chevronRight}</button>
  `;
});
