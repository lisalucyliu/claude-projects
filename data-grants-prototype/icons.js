/* Inline SVG icon set — no external requests, mirrors Cloudscape's outline icon style */
const Icons = {
  /* Simplified AWS wordmark: orange "aws" with the smile-arrow swoosh. */
  awsLogo: `<svg width="46" height="18" viewBox="0 0 46 18" fill="none"><text x="0" y="13" font-family="Arial, sans-serif" font-weight="700" font-size="15" font-style="italic" fill="#FF9900" letter-spacing="-0.5">aws</text><path d="M1 16.5c8 3.5 30 3.5 44 -2.5" stroke="#FF9900" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M41.5 12.3 45 14l-2.3 3.2" stroke="#FF9900" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,

  grid: `<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="0.5" y="0.5" width="4.5" height="4.5" rx="1"/><rect x="6.75" y="0.5" width="4.5" height="4.5" rx="1"/><rect x="13" y="0.5" width="4.5" height="4.5" rx="1"/><rect x="0.5" y="6.75" width="4.5" height="4.5" rx="1"/><rect x="6.75" y="6.75" width="4.5" height="4.5" rx="1"/><rect x="13" y="6.75" width="4.5" height="4.5" rx="1"/><rect x="0.5" y="13" width="4.5" height="4.5" rx="1"/><rect x="6.75" y="13" width="4.5" height="4.5" rx="1"/><rect x="13" y="13" width="4.5" height="4.5" rx="1"/></svg>`,

  hamburger: `<svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4.5h14M2 9h14M2 13.5h14" stroke-linecap="round"/></svg>`,

  chevronLeftNav: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8.5 3 5 7l3.5 4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  search: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.25"/><path d="M11 11l3.5 3.5" stroke-linecap="round"/></svg>`,

  bell: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 13.5h10l-1.2-2A6 6 0 0 1 12 8V7a3 3 0 0 0-6 0v1a6 6 0 0 1-.8 3.5L4 13.5Z" stroke-linejoin="round"/><path d="M7.2 15.5a1.8 1.8 0 0 0 3.6 0" stroke-linecap="round"/></svg>`,

  help: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="9" r="7"/><path d="M6.8 7a2.2 2.2 0 1 1 3.2 2c-.7.5-1 .9-1 1.7" stroke-linecap="round"/><circle cx="9" cy="12.8" r=".2" fill="currentColor" stroke="none"/></svg>`,

  gear: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="9" r="2.6"/><path d="M9 2.5v1.6M9 13.9v1.6M15.5 9h-1.6M4.1 9H2.5M13.4 4.6l-1.1 1.1M5.7 12.3l-1.1 1.1M13.4 13.4l-1.1-1.1M5.7 5.7 4.6 4.6" stroke-linecap="round"/></svg>`,

  chevronDown: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 5.5 7 9.5l4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  chevronDownSmall: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 3.5 5 6.5l3-3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  chevronLeft: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8.5 3 5 7l3.5 4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  chevronRight: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5.5 3 9 7l-3.5 4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  externalLink: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 2H2.5a1 1 0 0 0-1 1v7.5a1 1 0 0 0 1 1H10a1 1 0 0 0 1-1V8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 2h4v4M11 2 6 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  close: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke-linecap="round"/></svg>`,

  info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6.5"/><path d="M8 7.3v4" stroke-linecap="round"/><circle cx="8" cy="5" r=".25" fill="currentColor" stroke="none"/></svg>`,

  refresh: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.8 7.5A5.3 5.3 0 1 1 11 3.6" stroke-linecap="round"/><path d="M12.8 2.8v3.3h-3.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  settingsTable: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="7.5" cy="7.5" r="2.2"/><path d="M7.5 1.7v1.3M7.5 12v1.3M13.3 7.5H12M3 7.5H1.7M11.2 3.8l-.9.9M4.7 10.3l-.9.9M11.2 11.2l-.9-.9M4.7 4.7l-.9-.9" stroke-linecap="round"/></svg>`,

  sort: `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1.5 8.5 5h-5L6 1.5Z"/><path d="M6 10.5 3.5 7h5L6 10.5Z"/></svg>`,

  sortAsc: `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1.5 8.5 5h-5L6 1.5Z"/><path d="M6 10.5 3.5 7h5L6 10.5Z" opacity=".3"/></svg>`,

  sortDesc: `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1.5 8.5 5h-5L6 1.5Z" opacity=".3"/><path d="M6 10.5 3.5 7h5L6 10.5Z"/></svg>`,

  statusPending: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="7" cy="7" r="6"/><path d="M7 3.8V7l2.3 1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  statusAccepted: `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="7" r="7"/><path d="M4 7.2 6.1 9.3 10.2 5" stroke="white" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  statusWarning: `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 1.2 13.3 12H.7L7 1.2Z"/><path d="M7 5.3v3" stroke="white" stroke-width="1.3" stroke-linecap="round"/><circle cx="7" cy="10.1" r=".2" fill="white"/></svg>`,

  statusProcessing: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12.5 7A5.5 5.5 0 1 1 10.6 3" stroke-linecap="round"/></svg>`,

  networkNodes: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="15" width="6" height="6" rx="1"/><rect x="15" y="6" width="6" height="6" rx="1"/><rect x="15" y="24" width="6" height="6" rx="1"/><rect x="26" y="15" width="6" height="6" rx="1"/><path d="M10 18h5M21 18h5M18 12v4M18 20v4" stroke-linecap="round"/></svg>`,

  paperPlane: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M32 4 4 15.5l11 3.5 3.5 11L32 4Z" stroke-linejoin="round"/><path d="M15 19.5 32 4" stroke-linecap="round"/></svg>`,

  checkCircleBig: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="18" r="14.5"/><path d="M12 18.5l4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  radioBlank: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6.3"/></svg>`,

  kebab: `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="2.3" r="1.3"/><circle cx="7" cy="7" r="1.3"/><circle cx="7" cy="11.7" r="1.3"/></svg>`,

  arrowRight: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 14h18M16 8l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
