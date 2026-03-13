import { createContext, useContext, useEffect, useState } from "react";
import socket from "../sockets/socket";
import { fetchAllStudentsRequests } from "../services/student_service";
import { fetchCashierStudents } from "../services/cashier_service";

const StudentContext = createContext();

export function StudentProvider({ children, role }) {
  const [students, setStudents] = useState({
    all: [],
    cashier: [],
  });

  const loadStudents = async () => {
    try {
      if (role === "admin" || role === "rmo") {
        const data = await fetchAllStudentsRequests();
        setStudents((prev) => ({
          ...prev,
          all: data,
        }));
      }

      if (role === "cashier") {
        const data = await fetchCashierStudents();
        setStudents((prev) => ({
          ...prev,
          cashier: data,
        }));
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  useEffect(() => {
    if (!role) return;

    loadStudents();

    const handleUpdate = async () => {
      console.log("Students updated via socket. Refetching...");
      await loadStudents();
    };

    socket.on("studentsUpdated", handleUpdate);

    return () => {
      socket.off("studentsUpdated", handleUpdate);
    };
  }, [role]);

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        reloadStudents: loadStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentStore() {
  return useContext(StudentContext);
}
