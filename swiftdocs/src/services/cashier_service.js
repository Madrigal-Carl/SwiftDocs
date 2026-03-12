import api from "../api/api";

export async function fetchCashierStudents() {
  const res = await api.get("/cashier/students");
  return res.data;
}