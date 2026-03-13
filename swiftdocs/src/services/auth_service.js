import api from "../api/api";

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}
