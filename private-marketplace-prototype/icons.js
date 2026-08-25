/* Inline SVG icon set — no external requests, mirrors Cloudscape's outline icon style */
const Icons = {
  /* Real AWS logo paths (via commons.wikimedia.org/wiki/File:Amazon_Web_Services_Logo.svg),
     recolored white for the dark header instead of the source's navy #252F3E. */
  awsLogo: `<svg width="32" height="20" viewBox="0 0 304 182" xmlns="http://www.w3.org/2000/svg"><path fill="#F9F9FA" d="M86.4,66.4c0,3.7,0.4,6.7,1.1,8.9c0.8,2.2,1.8,4.6,3.2,7.2c0.5,0.8,0.7,1.6,0.7,2.3c0,1-0.6,2-1.9,3l-6.3,4.2c-0.9,0.6-1.8,0.9-2.6,0.9c-1,0-2-0.5-3-1.4C76.2,90,75,88.4,74,86.8c-1-1.7-2-3.6-3.1-5.9c-7.8,9.2-17.6,13.8-29.4,13.8c-8.4,0-15.1-2.4-20-7.2c-4.9-4.8-7.4-11.2-7.4-19.2c0-8.5,3-15.4,9.1-20.6c6.1-5.2,14.2-7.8,24.5-7.8c3.4,0,6.9,0.3,10.6,0.8c3.7,0.5,7.5,1.3,11.5,2.2v-7.3c0-7.6-1.6-12.9-4.7-16c-3.2-3.1-8.6-4.6-16.3-4.6c-3.5,0-7.1,0.4-10.8,1.3c-3.7,0.9-7.3,2-10.8,3.4c-1.6,0.7-2.8,1.1-3.5,1.3c-0.7,0.2-1.2,0.3-1.6,0.3c-1.4,0-2.1-1-2.1-3.1v-4.9c0-1.6,0.2-2.8,0.7-3.5c0.5-0.7,1.4-1.4,2.8-2.1c3.5-1.8,7.7-3.3,12.6-4.5c4.9-1.3,10.1-1.9,15.6-1.9c11.9,0,20.6,2.7,26.2,8.1c5.5,5.4,8.3,13.6,8.3,24.6V66.4z M45.8,81.6c3.3,0,6.7-0.6,10.3-1.8c3.6-1.2,6.8-3.4,9.5-6.4c1.6-1.9,2.8-4,3.4-6.4c0.6-2.4,1-5.3,1-8.7v-4.2c-2.9-0.7-6-1.3-9.2-1.7c-3.2-0.4-6.3-0.6-9.4-0.6c-6.7,0-11.6,1.3-14.9,4c-3.3,2.7-4.9,6.5-4.9,11.5c0,4.7,1.2,8.2,3.7,10.6C37.7,80.4,41.2,81.6,45.8,81.6z M126.1,92.4c-1.8,0-3-0.3-3.8-1c-0.8-0.6-1.5-2-2.1-3.9L96.7,10.2c-0.6-2-0.9-3.3-0.9-4c0-1.6,0.8-2.5,2.4-2.5h9.8c1.9,0,3.2,0.3,3.9,1c0.8,0.6,1.4,2,2,3.9l16.8,66.2l15.6-66.2c0.5-2,1.1-3.3,1.9-3.9c0.8-0.6,2.2-1,4-1h8c1.9,0,3.2,0.3,4,1c0.8,0.6,1.5,2,1.9,3.9l15.8,67l17.3-67c0.6-2,1.3-3.3,2-3.9c0.8-0.6,2.1-1,3.9-1h9.3c1.6,0,2.5,0.8,2.5,2.5c0,0.5-0.1,1-0.2,1.6c-0.1,0.6-0.3,1.4-0.7,2.5l-24.1,77.3c-0.6,2-1.3,3.3-2.1,3.9c-0.8,0.6-2.1,1-3.8,1h-8.6c-1.9,0-3.2-0.3-4-1c-0.8-0.7-1.5-2-1.9-4L156,23l-15.4,64.4c-0.5,2-1.1,3.3-1.9,4c-0.8,0.7-2.2,1-4,1H126.1z M254.6,95.1c-5.2,0-10.4-0.6-15.4-1.8c-5-1.2-8.9-2.5-11.5-4c-1.6-0.9-2.7-1.9-3.1-2.8c-0.4-0.9-0.6-1.9-0.6-2.8v-5.1c0-2.1,0.8-3.1,2.3-3.1c0.6,0,1.2,0.1,1.8,0.3c0.6,0.2,1.5,0.6,2.5,1c3.4,1.5,7.1,2.7,11,3.5c4,0.8,7.9,1.2,11.9,1.2c6.3,0,11.2-1.1,14.6-3.3c3.4-2.2,5.2-5.4,5.2-9.5c0-2.8-0.9-5.1-2.7-7c-1.8-1.9-5.2-3.6-10.1-5.2L246,52c-7.3-2.3-12.7-5.7-16-10.2c-3.3-4.4-5-9.3-5-14.5c0-4.2,0.9-7.9,2.7-11.1c1.8-3.2,4.2-6,7.2-8.2c3-2.3,6.4-4,10.4-5.2c4-1.2,8.2-1.7,12.6-1.7c2.2,0,4.5,0.1,6.7,0.4c2.3,0.3,4.4,0.7,6.5,1.1c2,0.5,3.9,1,5.7,1.6c1.8,0.6,3.2,1.2,4.2,1.8c1.4,0.8,2.4,1.6,3,2.5c0.6,0.8,0.9,1.9,0.9,3.3v4.7c0,2.1-0.8,3.2-2.3,3.2c-0.8,0-2.1-0.4-3.8-1.2c-5.7-2.6-12.1-3.9-19.2-3.9c-5.7,0-10.2,0.9-13.3,2.8c-3.1,1.9-4.7,4.8-4.7,8.9c0,2.8,1,5.2,3,7.1c2,1.9,5.7,3.8,11,5.5l14.2,4.5c7.2,2.3,12.4,5.5,15.5,9.6c3.1,4.1,4.6,8.8,4.6,14c0,4.3-0.9,8.2-2.6,11.6c-1.8,3.4-4.2,6.4-7.3,8.8c-3.1,2.5-6.8,4.3-11.1,5.6C264.4,94.4,259.7,95.1,254.6,95.1z"/><g fill="#FF9900"><path d="M273.5,143.7c-32.9,24.3-80.7,37.2-121.8,37.2c-57.6,0-109.5-21.3-148.7-56.7c-3.1-2.8-0.3-6.6,3.4-4.4c42.4,24.6,94.7,39.5,148.8,39.5c36.5,0,76.6-7.6,113.5-23.2C274.2,133.6,278.9,139.7,273.5,143.7z"/><path d="M287.2,128.1c-4.2-5.4-27.8-2.6-38.5-1.3c-3.2,0.4-3.7-2.4-0.8-4.5c18.8-13.2,49.7-9.4,53.3-5c3.6,4.5-1,35.4-18.6,50.2c-2.7,2.3-5.3,1.1-4.1-1.9C282.5,155.7,291.4,133.4,287.2,128.1z"/></g></svg>`,

  grid: `<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="0.5" y="0.5" width="4.5" height="4.5" rx="1"/><rect x="6.75" y="0.5" width="4.5" height="4.5" rx="1"/><rect x="13" y="0.5" width="4.5" height="4.5" rx="1"/><rect x="0.5" y="6.75" width="4.5" height="4.5" rx="1"/><rect x="6.75" y="6.75" width="4.5" height="4.5" rx="1"/><rect x="13" y="6.75" width="4.5" height="4.5" rx="1"/><rect x="0.5" y="13" width="4.5" height="4.5" rx="1"/><rect x="6.75" y="13" width="4.5" height="4.5" rx="1"/><rect x="13" y="13" width="4.5" height="4.5" rx="1"/></svg>`,

  hamburger: `<svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4.5h14M2 9h14M2 13.5h14" stroke-linecap="round"/></svg>`,

  chevronLeftNav: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8.5 3 5 7l3.5 4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  search: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.25"/><path d="M11 11l3.5 3.5" stroke-linecap="round"/></svg>`,

  dragHandle: `<svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"><circle cx="2" cy="2" r="1.3"/><circle cx="8" cy="2" r="1.3"/><circle cx="2" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="2" cy="14" r="1.3"/><circle cx="8" cy="14" r="1.3"/></svg>`,

  bell: `<svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 13.5h10l-1.2-2A6 6 0 0 1 12 8V7a3 3 0 0 0-6 0v1a6 6 0 0 1-.8 3.5L4 13.5Z" stroke-linejoin="round"/><path d="M7.2 15.5a1.8 1.8 0 0 0 3.6 0" stroke-linecap="round"/></svg>`,

  help: `<svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="9" r="7"/><path d="M6.8 7a2.2 2.2 0 1 1 3.2 2c-.7.5-1 .9-1 1.7" stroke-linecap="round"/><circle cx="9" cy="12.8" r=".2" fill="currentColor" stroke="none"/></svg>`,

  gear: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="9" r="2.6"/><path d="M9 2.5v1.6M9 13.9v1.6M15.5 9h-1.6M4.1 9H2.5M13.4 4.6l-1.1 1.1M5.7 12.3l-1.1 1.1M13.4 13.4l-1.1-1.1M5.7 5.7 4.6 4.6" stroke-linecap="round"/></svg>`,

  chevronDown: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 5.5 7 9.5l4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* Matches Cloudscape's own expand/collapse-link-group glyph exactly
     (verified via devtools on cloudscape.design/patterns/general/
     service-navigation/side-navigation/): a solid downward triangle,
     not an outlined chevron. */
  triangleDown: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m8 11 4-6H4l4 6Z"/></svg>`,

  chevronDownSmall: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 3.5 5 6.5l3-3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  chevronLeft: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8.5 3 5 7l3.5 4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  chevronRight: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5.5 3 9 7l-3.5 4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* Verified against cloudscape.design/components/link/?example=external-link
     via computed style + outerHTML of the live "Learn more" link's icon
     (name-external): 16x16, stroke-width 2, rounded joins, no rounded caps. */
  externalLink: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 9.012v-6H7M13.02 3 7 9.01"/><path d="M3 5.012v8h8.01"/></svg>`,

  close: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke-linecap="round"/></svg>`,

  info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6.5"/><path d="M8 7.3v4" stroke-linecap="round"/><circle cx="8" cy="5" r=".25" fill="currentColor" stroke="none"/></svg>`,

  refresh: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.8 7.5A5.3 5.3 0 1 1 11 3.6" stroke-linecap="round"/><path d="M12.8 2.8v3.3h-3.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* Exact path from cloudscape.design/components/icon/?example=settings
     (name="settings") — the real gear glyph, not an approximation. */
  settingsTable: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.11 1.729c.07-.42.44-.729.86-.729h2.02c.43 0 .79.31.86.729l.17.999c.05.29.24.529.5.679.06.03.11.06.17.1.25.15.56.2.84.1l.95-.35c.4-.15.85 0 1.07.38l1.01 1.747c.21.37.13.839-.2 1.108l-.78.64c-.23.189-.34.479-.33.768v.2c0 .29.11.579.33.769l.78.639c.33.27.42.739.2 1.108l-1.01 1.748c-.21.37-.66.529-1.06.38l-.95-.35a.966.966 0 0 0-.84.1c-.06.03-.11.07-.17.1-.26.14-.45.389-.5.679l-.17.998A.878.878 0 0 1 9 15H6.98a.87.87 0 0 1-.86-.729l-.17-.998a.988.988 0 0 0-.5-.68c-.06-.03-.11-.06-.17-.1a.996.996 0 0 0-.84-.1l-.95.35c-.4.15-.85 0-1.06-.38l-1.01-1.747a.873.873 0 0 1 .2-1.108l.78-.64c.23-.189.34-.479.33-.768v-.2c0-.3-.11-.579-.33-.769l-.78-.639a.861.861 0 0 1-.2-1.108l1.01-1.748c.21-.37.66-.529 1.07-.38l.95.35c.28.1.58.06.84-.1.06-.03.11-.07.17-.1.26-.14.45-.379.5-.678l.15-1Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 8c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2Z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* Sort triangles — verified against cloudscape.design/components/table/:
     unsorted is a muted down-triangle; active sort is the same shape
     (down = descending, up = ascending) filled dark. */
  /* Verified against cloudscape.design/examples/react/table.html: the
     unsorted-column icon is a hollow, stroke-only triangle (fill:none,
     2px stroke), not a small solid-filled one — only the active sort
     direction's icon is actually filled solid, and even then with the
     same 2px rounded-join stroke on top so its corners stay rounded
     like every other triangle glyph in the app. currentColor lets the
     th's own text color (secondary by default, heading when .sorted)
     drive both fill and stroke. */
  sortNeutral: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m8 11 4-6H4l4 6Z"/></svg>`,
  sortAsc: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m8 5 4 6H4l4-6Z"/></svg>`,
  sortDesc: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m8 11 4-6H4l4 6Z"/></svg>`,

  /* Status-indicator icons — verified against cloudscape.design/components/status-indicator/ */
  statusPending: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="7"/><path d="M8 4v5H4" stroke-linejoin="round"/></svg>`,
  statusAccepted: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="7"/><path d="M4.5 7.5 7 10l4-5" stroke-linejoin="round"/></svg>`,
  statusWarning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 5v4M8 10v2M6.52 1.88l-5.33 9.76c-.13.23-.19.5-.19.76 0 .88.71 1.59 1.59 1.59H13.4c.88 0 1.59-.71 1.59-1.59 0-.27-.07-.53-.19-.76L9.48 1.88C9.18 1.34 8.62 1 8 1s-1.18.34-1.48.88Z" stroke-linejoin="round"/></svg>`,
  statusProcessing: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12.5 7A5.5 5.5 0 1 1 10.6 3" stroke-linecap="round"/></svg>`,
  statusError: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="7"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke-linecap="round"/></svg>`,

  copy: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.5"/><path d="M10.5 5.5V3.5a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* Manual-refresh icon — verified against cloudscape.design/patterns/general/loading-and-refreshing/ */
  refreshCircular: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 0v5l-5-.04" stroke-linejoin="round"/><path d="M15 8c0 3.87-3.13 7-7 7s-7-3.13-7-7 3.13-7 7-7c2.79 0 5.2 1.63 6.33 4"/></svg>`,

  networkNodes: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="15" width="6" height="6" rx="1"/><rect x="15" y="6" width="6" height="6" rx="1"/><rect x="15" y="24" width="6" height="6" rx="1"/><rect x="26" y="15" width="6" height="6" rx="1"/><path d="M10 18h5M21 18h5M18 12v4M18 20v4" stroke-linecap="round"/></svg>`,

  paperPlane: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M32 4 4 15.5l11 3.5 3.5 11L32 4Z" stroke-linejoin="round"/><path d="M15 19.5 32 4" stroke-linecap="round"/></svg>`,

  checkCircleBig: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="18" r="14.5"/><path d="M12 18.5l4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  radioBlank: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6.3"/></svg>`,

  kebab: `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="2.3" r="1.3"/><circle cx="7" cy="7" r="1.3"/><circle cx="7" cy="11.7" r="1.3"/></svg>`,

  arrowRight: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 14h18M16 8l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* Flashbar icons — exact paths verified against cloudscape.design/components/flashbar/ */
  flashSuccess: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="7"/><path d="M4.5 7.5 7 10l4-5" stroke-linejoin="round"/></svg>`,
  flashError: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="7"/><path d="m5.5 5.5 5 5M10.5 5.5l-5 5"/></svg>`,
  flashInfo: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="7"/><path d="M8 12V7M8 6V4"/></svg>`,
  flashWarning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 5v4M8 10v2M6.52 1.88l-5.33 9.76c-.13.23-.19.5-.19.76 0 .88.71 1.59 1.59 1.59H13.4c.88 0 1.59-.71 1.59-1.59 0-.27-.07-.53-.19-.76L9.48 1.88c-.63-1.15-2.33-1.15-2.96 0Z" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  flashDismiss: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m2 1.71 12 12M2 13.71l12-12" stroke-linejoin="round"/></svg>`,

  /* Status indicator "stopped"/"not live" — grey circle with minus, matches
     the same status-indicator family as statusAccepted/statusWarning. */
  statusStopped: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="7"/><path d="M5 8h6" stroke-linecap="round"/></svg>`,

  /* Filled circular play button, used for the video-thumbnail placeholder
     on the Private Marketplace homepage hero. */
  play: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="26" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2"/><g transform="translate(-2,0)"><path d="M27 22.5v19c0 1.3 1.4 2.1 2.5 1.4l15-9.5a1.6 1.6 0 0 0 0-2.7l-15-9.5c-1.1-.7-2.5.1-2.5 1.3Z" fill="currentColor"/></g></svg>`,

  /* Paint palette, used for the "Customize branding" step of the "How it
     works" flow. */
  palette: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M9 1.5a7.5 7.5 0 1 0 0 15c.9 0 1.5-.7 1.5-1.5 0-.4-.15-.75-.4-1.02-.24-.26-.4-.6-.4-.98 0-.8.65-1.5 1.5-1.5H13a3 3 0 0 0 3-3c0-3.87-3.13-7-7-7Z" stroke-linejoin="round"/><circle cx="5.5" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="4.5" r="1" fill="currentColor" stroke="none"/><circle cx="12.5" cy="7" r="1" fill="currentColor" stroke="none"/></svg>`,

  /* Exact paths from cloudscape.design/foundation/visual-foundation/iconography/
     (name="folder" / name="folder-open") — collapsed tree rows use the
     closed glyph, expanded rows use the open one. */
  folder: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M15 5v9H2V2h6l1 2h5c.55 0 1 .45 1 1Z" stroke-linejoin="round"/></svg>`,

  folderOpen: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 14h8l-3-7H1l2 7h3Z" stroke-linejoin="round"/><path d="M2 7V2h6l1 2h5c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1h-1" stroke-linejoin="round"/></svg>`,

  account: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="7" cy="4.6" r="2.4"/><path d="M2 12.5c.7-2.6 2.7-4 5-4s4.3 1.4 5 4" stroke-linecap="round"/></svg>`,

  treeToggle: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2l4 3-4 3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* Wizard step indicators */
  stepComplete: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="4"/></svg>`,
  stepActive: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="8.2"/><circle cx="10" cy="10" r="4" fill="currentColor" stroke="none"/></svg>`,
  stepIncomplete: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="10" r="8.2"/></svg>`,

  editPencil: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M9.5 1.5 12.5 4.5 5 12H2v-3Z" stroke-linejoin="round"/></svg>`,
};
