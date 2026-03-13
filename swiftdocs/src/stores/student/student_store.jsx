import { useContext } from "react";
import { StudentContext } from "./student_context";

export function useStudentStore() {
  return useContext(StudentContext);
}
