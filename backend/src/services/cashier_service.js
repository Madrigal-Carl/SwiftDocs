const studentRepository = require("../repositories/student_repository");

async function GetStudentsForCashier() {
  const allowedStatuses = ["paid", "overdue", "invoiced"];

  const students = await studentRepository.FindAllStudents(null, {
    include: [
      {
        association: "request",
        where: {
          status: allowedStatuses,
        },
        required: true,
        include: ["documents"],
      },
    ],
  });

  return students.map((s) => s.toJSON());
}

module.exports = {
  GetStudentsForCashier,
};