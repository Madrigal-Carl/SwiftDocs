export function getRequestPermissions(role, status) {
  if (!role || !status) return { view: false, approve: false, reject: false };

  // Admin: view only
  if (role === "admin") {
    return { view: true, approve: false, reject: false };
  }

  // RMO
  if (role === "rmo") {
    if (status === "pending") {
      return { view: true, approve: true, reject: true };
    }

    if (status === "paid") {
      return { view: true, approve: true, reject: false };
    }

    return { view: true, approve: false, reject: false };
  }

  // Cashier
  if (role === "cashier") {
    if (status === "pending") {
      return { view: true, approve: true, reject: true };
    }

    if (status === "invoiced") {
      return { view: true, approve: true, reject: false };
    }

    return { view: true, approve: false, reject: false };
  }

  return { view: true, approve: false, reject: false };
}
