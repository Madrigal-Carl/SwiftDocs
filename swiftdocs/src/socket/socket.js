import { io } from "socket.io-client";
import {
  fetchAllStudentsRequests,
  fetchStudentsByStatus,
} from "../services/student_service";
import {
  updateAllStudents,
  updateStudentsByStatus,
} from "../stores/student_store";

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

socket.on("refreshStudentsRequests", async () => {
  console.log("Refreshing all student requests via socket...");
  const students = await fetchAllStudentsRequests();
  updateAllStudents(students);
});

socket.on("studentsUpdated", async ({ status }) => {
  if (!status) return;
  console.log(`Refreshing students with status: ${status} via socket...`);
  const students = await fetchStudentsByStatus(status);
  updateStudentsByStatus(status, students);
});

export default socket;
