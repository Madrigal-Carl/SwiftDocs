export function getNextStatus(role, currentStatus, action) {
  if (action === "reject") {
    if (role === "rmo" && currentStatus === "pending") {
      return "rejected";
    }
    return null;
  }

  if (action === "approve") {
    if (role === "rmo" && currentStatus === "pending") return "invoiced";
    if (role === "cashier" && currentStatus === "invoiced") return "paid";
    if (role === "rmo" && currentStatus === "paid") return "released";
  }

  return null;
}
