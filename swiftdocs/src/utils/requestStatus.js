export function getNextStatus(role, currentStatus, action) {
  if (action === "reject") {
    if (role === "cashier" && currentStatus === "pending") {
      return "balance_due";
    }

    if (role === "rmo" && currentStatus === "pending") {
      return "deficient";
    }

    return null;
  }

  if (action === "approve") {
    // CASHIER FLOW
    if (role === "cashier" && currentStatus === "pending") return "invoiced";

    if (role === "cashier" && currentStatus === "invoiced") return "paid";

    // RMO FLOW
    if (role === "rmo" && currentStatus === "pending") return "invoiced";

    if (role === "rmo" && currentStatus === "paid") return "released";
  }

  return null;
}
