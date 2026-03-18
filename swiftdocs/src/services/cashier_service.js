import api from "../api/api";

export async function fetchCashierRequests(page = 1, limit = 6) {
  const res = await api.get("/cashier/requests", {
    params: { page, limit },
  });

  return res.data;
}
