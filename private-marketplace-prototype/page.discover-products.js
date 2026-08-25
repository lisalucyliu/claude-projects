/* Page wiring for discover-products.html */

document.addEventListener("DOMContentLoaded", () => {
  mountChrome("discover-products", [
    { label: "AWS Marketplace", href: "dashboard.html" },
    { label: "Discover products" },
  ]);
  hydrateIcons();
  initSharedUI();

  const total = DISCOVER_PRODUCTS.length;
  document.getElementById("discover-count").textContent = `(${total} results)`;
  document.getElementById("discover-showing").textContent = String(total);

  const listEl = document.getElementById("product-list");
  listEl.innerHTML = DISCOVER_PRODUCTS.map(
    (p) => `
    <div class="product-card">
      <div class="product-card__icon" style="background:${p.iconColor};">${p.iconInitial}</div>
      <div class="product-card__content">
        <a class="product-card__title" href="#" onclick="return false;">${escapeHtml(p.name)}</a>
        <p class="product-card__meta">By <a href="#" onclick="return false;">${escapeHtml(p.publisher)}</a>${p.version ? ` | Ver ${escapeHtml(p.version)}` : ""}</p>
        <span class="badge badge--pmp">Approved for purchase</span>
        <p class="product-card__desc">${escapeHtml(p.description)}</p>
      </div>
    </div>
  `
  ).join("");

  // Single page of results for this demo — pagination is rendered for
  // visual completeness (matching the wireframe) but only ever shows page 1.
  const paginationEl = document.querySelector("[data-pagination]");
  paginationEl.innerHTML = `
    <button class="page-btn" data-page="prev" disabled>${Icons.chevronLeft}</button>
    <button class="page-btn current" data-page="1">1</button>
    <button class="page-btn" data-page="next" disabled>${Icons.chevronRight}</button>
  `;
});
