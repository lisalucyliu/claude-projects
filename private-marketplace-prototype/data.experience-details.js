/* Extended per-experience data for the experience-details page and its tabs
   (Details, Associated audience, Products, Branding settings), keyed by the
   same experience id used in data.experiences.js. Matches the Figma "PMP
   admin - experiences - experience details" screens. */

const EXPERIENCE_DETAILS = {
  "exp-0": {
    expId: "exp-hfa7q3gade2qi",
    ownerAccountId: "123456789012",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus.",
    productRequests: true,
    tags: [
      { key: "tag 1", value: "value 1" },
      { key: "tag 2", value: "value 2" },
    ],
    brandName: "Starbucks Private Marketplace",
    brandDescription:
      "This is a Private Marketplace for Starbucks software developers. Feel free to request more products! Visit www.dev.starbucks.not.really.com or contact shawnyu@starbucks.not.really.com for more info! YES, end user will see this!",
    associatedAudience: [
      { id: "aud-1", name: "Developer OU", accountId: "ou-12ab-1234abcd", type: "ou", relationship: "Associated" },
      { id: "aud-2", name: "Shawn's account", accountId: "123456789012", type: "account", relationship: "Inherited" },
    ],
    managedProductIds: ["wp-1", "wp-2", "wp-3", "wp-4"],
  },
};

function getExperienceId() {
  return new URLSearchParams(window.location.search).get("id") || "exp-0";
}

function findExperience(id) {
  return ACTIVE_EXPERIENCES.find((e) => e.id === id) || ARCHIVED_EXPERIENCES.find((e) => e.id === id);
}

/* Generic fallback so every row in the Experiences table has a working
   details page, not just the one the wireframes spelled out in full. */
function getExperienceDetails(id, name) {
  return (
    EXPERIENCE_DETAILS[id] || {
      expId: `exp-${id}`,
      ownerAccountId: "123456789012",
      description: "No description has been added for this experience yet.",
      productRequests: true,
      tags: [],
      brandName: name,
      brandDescription: "",
      associatedAudience: [],
      managedProductIds: [],
    }
  );
}
