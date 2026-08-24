/* Dummy data for the Change sets page and its detail pages, matching the
   Figma "PMP admin - change sets" screens. A change set with more than one
   change is expandable to show its individual changes inline; "View
   details" on a change set navigates to change-set-details.html, and
   drilling into one of its individual changes navigates to
   change-details.html. */

const CHANGE_SETS = [
  {
    id: "cs-1",
    changeType: "CreateExperience",
    status: "inprogress",
    statusLabel: "In progress",
    startTime: "November 20, 2023, 20:58:13 (UTC-05:00)",
    endTime: null,
    changes: [{ id: "ch-1", changeType: "CreateExperience", status: "inprogress", statusLabel: "In progress", entityIdentifier: "exp-hfa7q3gade2qi", entityType: "Experience@1.0" }],
  },
  {
    id: "cs-2",
    changeSetId: "7byz3ka0ivqf89pzj5vbf0qnu",
    changeType: "AssociateAudience",
    status: "error",
    statusLabel: "Error",
    startTime: "November 09, 2023, 20:18:39 (UTC-05:00)",
    endTime: "November 09, 2023, 20:18:43 (UTC-05:00)",
    arn: "arn:aws:aws-marketplace:us-east-1:867565478084:AWSMarketplace/ChangeSet/3zoi7qlqrfvbtz5wmdixq0drj",
    errorCode: "CLIENT_ERROR",
    errorDescription: "Change set preparation has failed. For details see 'ErrorDetailList'.",
    changes: [
      {
        id: "ch-2",
        changeType: "AssociateAudience",
        status: "error",
        statusLabel: "Error",
        entityIdentifier: "exp-hfa7q3gade2qi",
        entityType: "Experience@1.0",
        errorCode: "ENTITY_ALREADY_EXISTS",
        details: { Principals: ["431031500490"] },
        errorDetailList: [{ ErrorCode: "ENTITY_ALREADY_EXISTS", ErrorMessage: "An audience exists for account 431031500490. Disassociate previous audience before updating." }],
      },
      {
        id: "ch-3",
        changeType: "DisassociateAudience",
        status: "error",
        statusLabel: "Error",
        entityIdentifier: "exp-ktqni3owcc33a",
        entityType: "Experience@1.0",
        errorCode: "CLIENT_ERROR",
        details: { Principals: ["431031500490"] },
        errorDetailList: [{ ErrorCode: "CLIENT_ERROR", ErrorMessage: "Unable to disassociate audience for account 431031500490." }],
      },
    ],
  },
  {
    id: "cs-3",
    changeType: "DisassociateAudience",
    status: "succeeded",
    statusLabel: "Succeeded",
    startTime: "November 09, 2023, 20:10:27 (UTC-05:00)",
    endTime: "November 09, 2023, 20:10:31 (UTC-05:00)",
    arn: "arn:aws:aws-marketplace:us-east-1:867565478084:AWSMarketplace/ChangeSet/8ka0ivqf89pzj5vbf0qnu",
    changes: [{ id: "ch-4", changeType: "DisassociateAudience", status: "succeeded", statusLabel: "Succeeded", entityIdentifier: "exp-hfa7q3gade2qi", entityType: "Experience@1.0", details: { Principals: ["431031500490"] } }],
  },
  {
    id: "cs-4",
    changeType: "AllowProductProcurement",
    status: "succeeded",
    statusLabel: "Succeeded",
    startTime: "November 09, 2023, 20:04:30 (UTC-05:00)",
    endTime: "November 09, 2023, 20:04:34 (UTC-05:00)",
    arn: "arn:aws:aws-marketplace:us-east-1:867565478084:AWSMarketplace/ChangeSet/qf89pzj5vbf0qnu3zka0iv",
    changes: Array.from({ length: 10 }, (_, i) => ({
      id: `ch-allow-${i + 1}`,
      changeType: "AllowProductProcurement",
      status: "succeeded",
      statusLabel: "Succeeded",
      entityIdentifier: `wp-${(i % 5) + 1}`,
      entityType: "Product@1.0",
      details: { Principals: ["431031500490"] },
    })),
  },
  {
    id: "cs-5",
    changeType: "DenyProductProcurement",
    status: "cancelled",
    statusLabel: "Cancelled",
    startTime: "October 26, 2023, 16:02:46 (UTC-05:00)",
    endTime: "October 26, 2023, 16:02:46 (UTC-05:00)",
    arn: "arn:aws:aws-marketplace:us-east-1:867565478084:AWSMarketplace/ChangeSet/vbf0qnu3zka0ivqf89pzj5",
    changes: [{ id: "ch-5", changeType: "DenyProductProcurement", status: "cancelled", statusLabel: "Cancelled", entityIdentifier: "wp-1", entityType: "Product@1.0", details: { Principals: ["431031500490"] } }],
  },
];

function findChangeSet(id) {
  return CHANGE_SETS.find((cs) => cs.id === id);
}

function findChange(id) {
  for (const cs of CHANGE_SETS) {
    const change = cs.changes.find((c) => c.id === id);
    if (change) return { change, changeSet: cs };
  }
  return null;
}
