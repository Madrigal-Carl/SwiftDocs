const {
  FetchStaleRequests,
  FindRequestById,
} = require("../repositories/request_repository");

const { SendUpdateMail } = require("../services/mail_service");
const { CreateLog } = require("../repositories/log_repository");
const { findAdminAccount } = require("../repositories/account_repository");

async function checkStaleRequests() {
  try {
    console.log("🔍 Running stale request checker...");

    const admin = await findAdminAccount();
    if (!admin) return console.error("❌ No admin found");

    const requests = await FetchStaleRequests();

    for (const req of requests) {
      try {
        const fromStatus = req.status;

        if (req.isDeficient()) {
          req.markDeficientToRejected();
        } else if (req.isBalanceDue()) {
          req.markBalanceDueToRejected();
        } else {
          continue;
        }

        await req.save();

        await CreateLog({
          account_id: admin.id,
          request_id: req.id,
          role: "system",
          action: "rejected",
          from_status: fromStatus,
          to_status: "rejected",
          notes: "Auto-rejected after 3 months of inactivity",
        });

        await SendUpdateMail({
          request: req,
          status: "rejected",
          notes: "Auto-rejected after 3 months of inactivity",
        });

        console.log(`✅ Rejected ${req.reference_number}`);
      } catch (err) {
        console.error(`⚠️ Failed request ${req.id}:`, err.message);
      }
    }

    console.log("✅ Done");
  } catch (err) {
    console.error("❌ Cron error:", err);
  }
}

module.exports = { checkStaleRequests };
