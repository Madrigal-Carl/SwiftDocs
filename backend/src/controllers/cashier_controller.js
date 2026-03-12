const cashierService = require("../services/cashier_service");

async function GetStudentsForCashier(req, res) {
  try {
    const students = await cashierService.GetStudentsForCashier();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
}

module.exports = {
  GetStudentsForCashier,
};