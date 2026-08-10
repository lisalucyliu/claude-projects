/* Shared chrome: top header + left service navigation, rendered identically on every page. */

function renderTopHeader() {
  return `
    <header class="top-header">
      <div class="top-header__logo">${Icons.awsLogo}</div>
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
        <div class="side-nav__section-title" data-collapse-toggle>${Icons.chevronDown}<span>${section.title}</span></div>
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

function renderBreadcrumb(current) {
  return `
    <nav class="breadcrumb">
      <a href="sent-data-grants.html">AWS Data Exchange</a>
      <span class="sep">${Icons.chevronRight}</span>
      <span class="current">${current}</span>
    </nav>
  `;
}

/* Full-bleed strip under the top header: nav toggle + breadcrumbs + global
   info trigger, matching Cloudscape's AppLayout toolbar. */
function renderToolbar(breadcrumbCurrent) {
  return `
    <div class="toolbar">
      <button class="toolbar__menu-toggle" id="toolbar-menu-toggle" title="Toggle navigation"><span class="toolbar__menu-circle">${Icons.hamburger}</span></button>
      ${renderBreadcrumb(breadcrumbCurrent)}
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

function mountChrome(activeKey, breadcrumbCurrent) {
  document.getElementById("header-root").innerHTML = renderTopHeader();
  document.getElementById("toolbar-root").innerHTML = renderToolbar(breadcrumbCurrent);
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
