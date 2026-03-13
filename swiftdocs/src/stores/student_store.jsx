import { useContext } from "react";
import { StudentContext } from "./student_provider";

export function useStudentStore() {
  return useContext(StudentContext);
}
