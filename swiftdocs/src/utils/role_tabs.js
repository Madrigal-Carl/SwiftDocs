export const ROLE_TABS = {
  admin: "Document Requests",
  cashier: "Payment Verification",
  rmo: "Document Processing",
};

export const getTabByRole = (role) => {
  return ROLE_TABS[role] || ROLE_TABS.admin;
};
