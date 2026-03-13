import api from "../api/api";

export async function fetchCashierRequests() {
  const res = await api.get("/cashier/requests");
  return res.data;
}
