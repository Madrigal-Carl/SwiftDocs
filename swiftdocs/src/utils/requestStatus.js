export function getNextStatus(role, currentStatus, action) {
  if (action === "reject") {
    if (role === "cashier" && currentStatus === "pending") {
      return "balance_due";
    }

    if (role === "rmo" && currentStatus === "under_review") {
      return "deficient";
    }

    return null;
  }

  if (action === "approve") {
    // CASHIER FLOW
    if (role === "cashier" && currentStatus === "pending")
      return "under_review";

    if (role === "cashier" && currentStatus === "balance_due")
      return "under_review";

    if (role === "cashier" && currentStatus === "invoiced") return "paid";

    // RMO FLOW
    if (role === "rmo" && currentStatus === "under_review") return "invoiced";

    if (role === "rmo" && currentStatus === "deficient") return "invoiced";

    if (role === "rmo" && currentStatus === "paid") return "released";
  }

  return null;
}
