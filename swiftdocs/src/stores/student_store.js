import { createContext, useContext, useState } from "react";

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [allStudents, setAllStudents] = useState([]);
  const [studentsByStatus, setStudentsByStatus] = useState({});

  const updateAllStudents = (students) => setAllStudents(students);
  const updateStudentsByStatus = (status, students) =>
    setStudentsByStatus((prev) => ({ ...prev, [status]: students }));

  return (
    <StudentContext.Provider
      value={{
        allStudents,
        studentsByStatus,
        updateAllStudents,
        updateStudentsByStatus,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentStore() {
  return useContext(StudentContext);
}
