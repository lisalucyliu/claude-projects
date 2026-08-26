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
        <span class="top-header__shortcut">Alt+S</span>
      </div>
      <div class="top-header__spacer"></div>
      <button class="top-header__icon-btn" title="Notifications">${Icons.bell}</button>
      <div class="top-header__divider"></div>
      <button class="top-header__icon-btn" title="Help">${Icons.help}</button>
      <div class="top-header__divider"></div>
      <span class="top-header__region">N. Virginia ${Icons.chevronDownSmall}</span>
      <div class="top-header__divider"></div>
      <span class="top-header__user">MyRole/AWSUser @ 0123-4567-8901 ${Icons.chevronDownSmall}</span>
    </header>
  `;
}

const NAV_SECTIONS = [
  {
    title: "My data",
    items: [
      { key: "entitled-data", label: "Entitled data", href: "#" },
      { key: "owned-data-sets", label: "Owned data sets", href: "#" },
    ],
  },
  {
    title: "Exchanged data grants",
    items: [
      { key: "sent", label: "Sent data grants", href: "sent-data-grants.html" },
      { key: "received", label: "Received data grants", href: "received-data-grants.html" },
      { key: "settings", label: "Data grant settings", href: "#", badge: "New" },
    ],
  },
  {
    title: "Subscribed with AWS Marketplace",
    items: [
      { key: "browse-catalog", label: "Browse catalog", href: "#" },
      { key: "product-offers", label: "My product offers", href: "#" },
      { key: "active-subs", label: "Active subscriptions", href: "#" },
      { key: "sub-requests", label: "Subscription requests", href: "#" },
    ],
  },
  {
    title: "Published to AWS Marketplace",
    items: [
      { key: "products", label: "Products", href: "#" },
      { key: "sub-verification", label: "Subscription verification", href: "#" },
      { key: "send-notification", label: "Send notification", href: "#" },
    ],
  },
];

function renderSideNav(activeKey) {
  const sections = NAV_SECTIONS.map((section) => {
    const items = section.items
      .map((item) => {
        const activeClass = item.key === activeKey ? " active" : "";
        const badge = item.badge ? `<span class="side-nav__badge">${item.badge}</span>` : "";
        return `<li><a class="side-nav__link${activeClass}" href="${item.href}">${item.label}${badge}</a></li>`;
      })
      .join("");
    return `
      <div class="side-nav__section" data-collapsible>
        <div class="side-nav__section-title" data-collapse-toggle>${Icons.triangleDown}<span>${section.title}</span></div>
        <ul class="side-nav__items">${items}</ul>
      </div>
    `;
  }).join("");

  return `
    <nav class="side-nav">
      <div class="side-nav__header">
        <span class="side-nav__title">AWS Data Exchange</span>
        <button class="side-nav__close" title="Collapse navigation">${Icons.chevronLeftNav}</button>
      </div>
      ${sections}
      <hr class="side-nav__divider" />
      <div class="side-nav__external"><a href="https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html" target="_blank" rel="noopener">Documentation</a>${Icons.externalLink}</div>
      <div class="side-nav__external"><a href="#" onclick="return false;">Contact us</a>${Icons.externalLink}</div>
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
   already does once at page load covers the collapsed variant too.
   Ported from the private-marketplace-prototype's identical fix. */
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

/* Full-bleed strip under the top header: nav toggle + breadcrumbs + global
   info trigger, matching Cloudscape's AppLayout toolbar. */
function renderToolbar(breadcrumbTrail) {
  return `
    <div class="toolbar">
      <button class="toolbar__menu-toggle" id="toolbar-menu-toggle" title="Toggle navigation"><span class="toolbar__menu-circle">${Icons.hamburger}</span></button>
      ${renderBreadcrumb(breadcrumbTrail)}
      <div class="toolbar__spacer"></div>
      <button class="toolbar__info-btn" data-open-help title="Info">${Icons.info}</button>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="app-footer">
      <a href="#" onclick="return false;">Feedback</a>
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
