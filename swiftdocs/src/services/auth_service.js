import api from "../api/api";

// register (admin / rmo / cashier only)
export async function register(data) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

// login
export async function login(data) {
  const res = await api.post("/auth/login", data);
  return res.data;
}

// logout
export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}

// get current authenticated user
export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}
