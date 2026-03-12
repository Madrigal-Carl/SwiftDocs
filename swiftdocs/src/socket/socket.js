import { io } from "socket.io-client";
import { fetchAllStudentsRequests } from "../services/student_service";
import { updateAllStudents } from "../stores/student_store";

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

socket.on("studentsUpdated", async () => {
  console.log("Students updated via socket. Fetching all...");
  const students = await fetchAllStudentsRequests();
  updateAllStudents(students);
});

export default socket;
