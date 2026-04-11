const {
  FetchDeficientAndBalanceDueRequests,
  GetLatestLogByRequestId,
  FindRequestById,
} = require("../repositories/request_repository");
const { SendUpdateMail } = require("../services/mail_service");
const { CreateLog } = require("../repositories/log_repository");
const { findAdminAccount } = require("../repositories/account_repository");

// Helper: check if date is older than 3 months
function isOlderThan3Months(date) {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  return new Date(date) <= threeMonthsAgo;
}

// 🔥 Main job
async function checkStaleRequests() {
  try {
    console.log("🔍 Running daily request checker...");

    const admin = await findAdminAccount();

    if (!admin) {
      console.error("❌ No admin account found for logging");
      return;
    }

    const adminId = admin.id;

    const requests = await FetchDeficientAndBalanceDueRequests();

    for (const req of requests) {
      const latestLog = await GetLatestLogByRequestId(req.id);

      // If no logs, fallback to request created_at
      const basisDate = latestLog?.created_at || req.created_at;

      if (isOlderThan3Months(basisDate)) {
        // Reload full instance (important for instance methods)
        const requestInstance = await FindRequestById(req.id);

        if (!requestInstance) continue;

        try {
          if (requestInstance.isDeficient()) {
            requestInstance.markDeficientToRejected();
          } else if (requestInstance.isBalanceDue()) {
            requestInstance.markBalanceDueToRejected();
          } else {
            continue;
          }

          await requestInstance.save();

          await CreateLog({
            account_id: adminId,
            request_id: requestInstance.id,
            role: "system",
            action: "rejected",
            from_status: requestInstance.status,
            to_status: "rejected",
            notes: "Auto-rejected after 3 months of inactivity",
          });

          await SendUpdateMail({
            request: requestInstance,
            status: "rejected",
            notes: "Auto-rejected after 3 months of inactivity",
          });

          console.log(
            `✅ Request ${requestInstance.reference_number} marked as REJECTED`,
          );
        } catch (err) {
          console.error(`⚠️ Failed to update request ${req.id}:`, err.message);
        }
      }
    }

    console.log("✅ Daily checker finished");
  } catch (error) {
    console.error("❌ Cron job error:", error);
  }
}

module.exports = { checkStaleRequests };
