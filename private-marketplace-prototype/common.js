/* Shared chrome: top header + left service navigation, rendered identically on every page. */

function renderTopHeader() {
  return `
    <header class="top-header">
      <div class="top-header__logo">${Icons.awsLogo}</div>
      <div class="top-header__divider"></div>
      <div class="top-header__services">${Icons.grid}<span>Services</span></div>
      <div class="top-header__search">
        ${Icons.search}
        <input type="text" placeholder="Search for services, features, blogs, docs, and more" />
        <span class="top-header__shortcut">Option+S</span>
      </div>
      <div class="top-header__spacer"></div>
      <button class="top-header__icon-btn" title="Notifications">${Icons.bell}</button>
      <div class="top-header__divider"></div>
      <button class="top-header__icon-btn" title="Help">${Icons.help}</button>
      <div class="top-header__divider"></div>
      <span class="top-header__region">Global ${Icons.chevronDownSmall}</span>
      <div class="top-header__divider"></div>
      <span class="top-header__user">TestBuyer51 AWSMP ${Icons.chevronDownSmall}</span>
    </header>
  `;
}

/* Mixed nav: flat top-level links, one collapsible "Private Marketplace"
   group, then a flat "Settings" link — matches the actual AWS Marketplace
   nav shown in the source Figma screens (not every item groups into a
   titled section, unlike the Data Exchange nav). */
const NAV_FLAT_TOP = [
  { key: "discover-products", label: "Discover products", href: "discover-products.html" },
  { key: "procurement-insights", label: "Procurement insights", href: "#" },
  { key: "manage-subscriptions", label: "Manage subscriptions", href: "#" },
  { key: "private-offers", label: "Private offers", href: "#" },
  { key: "vendor-insights", label: "Vendor insights", href: "#" },
];

const NAV_PMP_GROUP = {
  title: "Private Marketplace",
  items: [
    { key: "my-pmp", label: "My Private Marketplace", href: "my-private-marketplace.html" },
    { key: "dashboard", label: "Dashboard", href: "dashboard.html" },
    { key: "org-structure", label: "Organizational structure", href: "organizational-structure.html" },
    { key: "experiences", label: "Experiences", href: "experiences.html" },
    { key: "change-sets", label: "Change sets", href: "change-sets.html" },
  ],
};

const NAV_FLAT_BOTTOM = [{ key: "settings", label: "Settings", href: "settings.html" }];

function renderSideNav(activeKey) {
  const flatTop = NAV_FLAT_TOP.map((item) => {
    const activeClass = item.key === activeKey ? " active" : "";
    return `<li><a class="side-nav__link${activeClass}" href="${item.href}">${item.label}</a></li>`;
  }).join("");

  const groupItems = NAV_PMP_GROUP.items
    .map((item) => {
      const activeClass = item.key === activeKey ? " active" : "";
      return `<li><a class="side-nav__link${activeClass}" href="${item.href}">${item.label}</a></li>`;
    })
    .join("");

  const flatBottom = NAV_FLAT_BOTTOM.map((item) => {
    const activeClass = item.key === activeKey ? " active" : "";
    return `<li><a class="side-nav__link${activeClass}" href="${item.href}">${item.label}</a></li>`;
  }).join("");

  return `
    <nav class="side-nav">
      <div class="side-nav__header">
        <span class="side-nav__title">AWS Marketplace</span>
        <button class="side-nav__close" title="Collapse navigation">${Icons.chevronLeftNav}</button>
      </div>
      <ul class="side-nav__items side-nav__items--flat">${flatTop}</ul>
      <div class="side-nav__section" data-collapsible>
        <div class="side-nav__section-title">
          <button class="side-nav__section-toggle" data-collapse-toggle title="Expand or collapse">${Icons.triangleDown}</button>
          <a class="side-nav__section-link${activeKey === "private-marketplace" ? " active" : ""}" href="private-marketplace.html">${NAV_PMP_GROUP.title}</a>
        </div>
        <ul class="side-nav__items">${groupItems}</ul>
      </div>
      <ul class="side-nav__items side-nav__items--flat">${flatBottom}</ul>
    </nav>
  `;
}

function renderBreadcrumbItems(trail) {
  return trail
    .map((item, i) => {
      const isLast = i === trail.length - 1;
      if (isLast) return `<span class="current">${item.label}</span>`;
      return `<a href="${item.href}">${item.label}</a><span class="sep">${Icons.chevronRight}</span>`;
    })
    .join("");
}

/* Verified against cloudscape.design/examples/react/edit.html: past 3
   items, BreadcrumbGroup collapses everything between the first and last
   two into a "..." control (a real dropdown listing the hidden items,
   not just decorative) once the viewport narrows. Both the full and
   collapsed markup are rendered up front and swapped by a media query —
   no resize listener needed — so the same dropdown wiring initDropdowns()
   already does once at page load covers the collapsed variant too. */
function renderBreadcrumb(trail) {
  if (trail.length <= 3) {
    return `<nav class="breadcrumb">${renderBreadcrumbItems(trail)}</nav>`;
  }

  const full = renderBreadcrumbItems(trail);

  const hiddenMiddle = trail.slice(1, trail.length - 2);
  const lastTwo = trail.slice(trail.length - 2);
  const menuItems = hiddenMiddle.map((item) => `<a href="${item.href}">${item.label}</a>`).join("");
  const collapsed = `
    <a href="${trail[0].href}">${trail[0].label}</a><span class="sep">${Icons.chevronRight}</span>
    <span class="breadcrumb__ellipsis btn-dropdown">
      <button class="breadcrumb__ellipsis-trigger" data-dropdown-trigger title="Show path" aria-label="Show path">&hellip;</button>
      <div class="dropdown-menu">${menuItems}</div>
    </span>
    <span class="sep">${Icons.chevronRight}</span>
    ${renderBreadcrumbItems(lastTwo)}
  `;

  return `
    <div class="breadcrumb-wrapper">
      <nav class="breadcrumb breadcrumb--full">${full}</nav>
      <nav class="breadcrumb breadcrumb--collapsed">${collapsed}</nav>
    </div>
  `;
}

function renderToolbar(trail) {
  return `
    <div class="toolbar">
      <button class="toolbar__menu-toggle" id="toolbar-menu-toggle" title="Toggle navigation"><span class="toolbar__menu-circle">${Icons.hamburger}</span></button>
      ${renderBreadcrumb(trail)}
      <div class="toolbar__spacer"></div>
      <button class="toolbar__info-btn" data-open-help title="Info">${Icons.info}</button>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="app-footer">
      <a href="#" onclick="return false;">CloudShell</a>
      <a href="#" onclick="return false;">Feedback</a>
      <a href="#" onclick="return false;">Language</a>
      <div>
        <span>© 2026, Amazon Web Services, Inc. or its affiliates.</span>
        <a href="#" onclick="return false;">Privacy</a>
        <a href="#" onclick="return false;">Terms</a>
        <a href="#" onclick="return false;">Cookie preferences</a>
      </div>
    </footer>
  `;
}

function mountChrome(activeKey, breadcrumbTrail) {
  document.getElementById("header-root").innerHTML = renderTopHeader();
  document.getElementById("toolbar-root").innerHTML = renderToolbar(breadcrumbTrail);
  document.getElementById("sidenav-root").innerHTML = renderSideNav(activeKey);
  const footerRoot = document.getElementById("footer-root");
  if (footerRoot) footerRoot.innerHTML = renderFooter();

  const appLayout = document.querySelector(".app-layout");
  const menuToggle = document.getElementById("toolbar-menu-toggle");
  const navClose = document.querySelector(".side-nav__close");
  const toggleNav = () => {
    const collapsed = appLayout.classList.toggle("nav-collapsed");
    menuToggle.classList.toggle("is-collapsed", collapsed);
  };
  menuToggle.addEventListener("click", toggleNav);
  if (navClose) navClose.addEventListener("click", toggleNav);
}
