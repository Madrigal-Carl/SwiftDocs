import api from "../api/api";

// get all accounts (with pagination)
export async function getAllAccounts(page = 1, filters = {}) {
  const res = await api.get("/accounts", {
    params: {
      page,
      limit: 5,
      search: filters.search || "",
      status: filters.status || "",
    },
  });

  return res.data;
}

// get single account
export async function getAccountById(id) {
  const res = await api.get(`/accounts/${id}`);
  return res.data;
}

// update account
export async function updateAccount(id, data) {
  const res = await api.patch(`/accounts/${id}`, data);
  return res.data;
}

// get account analytics
export async function getUserStats() {
  const res = await api.get("/accounts/analytics");
  return res.data;
}

// change password (logged-in user)
export async function changePassword(data) {
  const res = await api.patch("/accounts/change-password", data);
  return res.data;
}