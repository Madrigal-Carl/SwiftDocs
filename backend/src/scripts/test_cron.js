require("dotenv").config();

const { checkStaleRequests } = require("../services/request_checker_service");

(async () => {
  console.log("🚀 Running cron manually...");
  await checkStaleRequests();
  console.log("✅ Done");
  process.exit();
})();
