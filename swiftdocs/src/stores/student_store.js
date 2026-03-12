const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [allStudents, setAllStudents] = useState([]);

  const updateAllStudents = (students) => setAllStudents(students);

  return (
    <StudentContext.Provider
      value={{
        allStudents,
        updateAllStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentStore() {
  return useContext(StudentContext);
}
