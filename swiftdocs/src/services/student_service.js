import api from "../api/api";

export async function fetchAllStudentsRequests() {
  const res = await api.get("/students");
  return res.data;
}

export async function fetchStudentById(id) {
  const res = await api.get(`/students/${id}`);
  return res.data;
}

export async function createStudentRequest(data) {
  const res = await api.post("/students", data);
  return res.data;
}
