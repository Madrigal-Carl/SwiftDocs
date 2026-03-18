function computeStats(requests) {
  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const statuses = ["pending", "paid", "invoiced", "released", "rejected"];

  const countByStatus = {};
  const monthlyTrend = {};

  statuses.forEach((status) => {
    countByStatus[status] = 0;
  });

  let currentAll = 0;
  let prevAll = 0;

  const perStatusCurrent = {};
  const perStatusPrev = {};

  statuses.forEach((s) => {
    perStatusCurrent[s] = 0;
    perStatusPrev[s] = 0;
  });

  // =========================
  // NEW METRICS VARIABLES
  // =========================

  let revenueCurrent = 0;
  let revenuePrev = 0;

  let processingDaysCurrent = [];
  let processingDaysPrev = [];

  let completedCurrent = 0;
  let completedPrev = 0;

  let totalCurrent = 0;
  let totalPrev = 0;

  // =========================
  // 📈 MONTHLY AGGREGATIONS
  // =========================

  const monthlyCounts = {}; // { '2026-03': 12 }
  const monthlyRevenue = {}; // { '2026-03': 5000 }

  // =========================
  // 📄 DOCUMENT TYPE COUNTS
  // =========================

  const documentTypeCounts = {};

  // =========================
  // LOOP
  // =========================

  requests.forEach((req) => {
    const status = req.status;
    const date = new Date(req.request_date);

    if (countByStatus[status] !== undefined) {
      countByStatus[status]++;
    }

    const isCurrent =
      date.getMonth() === currentMonth && date.getFullYear() === currentYear;

    const isPrev =
      date.getMonth() === prevMonth && date.getFullYear() === prevYear;

    if (isCurrent) {
      currentAll++;
      totalCurrent++;
      if (perStatusCurrent[status] !== undefined) {
        perStatusCurrent[status]++;
      }
    }

    if (isPrev) {
      prevAll++;
      totalPrev++;
      if (perStatusPrev[status] !== undefined) {
        perStatusPrev[status]++;
      }
    }

    // =========================
    // 📅 MONTH KEY
    // =========================
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    // =========================
    // 📈 COUNT PER MONTH
    // =========================
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;

    // =========================
    // 💰 REVENUE (PAID + RELEASED ONLY)
    // =========================
    const isRevenueStatus = status === "paid" || status === "released";

    const totalPrice =
      req.total_price ??
      (typeof req.getGrandTotal === "function" ? req.getGrandTotal() : 0);

    if (isRevenueStatus && totalPrice) {
      // overall revenue
      if (isCurrent) revenueCurrent += totalPrice;
      if (isPrev) revenuePrev += totalPrice;

      // monthly revenue
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + totalPrice;
    }

    // =========================
    // ⏱ PROCESSING TIME
    // =========================
    if (req.request_completed) {
      const completedDate = new Date(req.request_completed);
      const diffDays = (completedDate - date) / (1000 * 60 * 60 * 24);

      if (isCurrent) processingDaysCurrent.push(diffDays);
      if (isPrev) processingDaysPrev.push(diffDays);
    }

    // =========================
    // ✅ COMPLETION RATE
    // =========================
    if (status === "released") {
      if (isCurrent) completedCurrent++;
      if (isPrev) completedPrev++;
    }

    // =========================
    // 📄 DOCUMENT TYPE COUNT
    // =========================
    if (isRevenueStatus) {
      const summary =
        typeof req.getDocumentSummary === "function"
          ? req.getDocumentSummary()
          : [];

      summary.forEach((doc) => {
        const type = doc.type || "Unknown";

        documentTypeCounts[type] =
          (documentTypeCounts[type] || 0) + (doc.quantity || 0);
      });
    }
  });

  // =========================
  // HELPERS
  // =========================

  function calcTrend(curr, prev) {
    if (prev === 0) return curr === 0 ? 0 : 100;
    return ((curr - prev) / prev) * 100;
  }

  function avg(arr) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  // =========================
  // EXISTING TREND
  // =========================

  const totalTrend = calcTrend(currentAll, prevAll);

  monthlyTrend["all"] = {
    value: `${Math.abs(totalTrend).toFixed(0)}%`,
    trendUp: totalTrend >= 0,
  };

  statuses.forEach((status) => {
    const trend = calcTrend(perStatusCurrent[status], perStatusPrev[status]);

    monthlyTrend[status] = {
      value: `${Math.abs(trend).toFixed(0)}%`,
      trendUp: trend >= 0,
    };
  });

  // =========================
  // 💰 REVENUE RESULT
  // =========================

  const revenueTrend = calcTrend(revenueCurrent, revenuePrev);

  const revenue = {
    total: revenueCurrent,
    trend: {
      value: `${Math.abs(revenueTrend).toFixed(0)}%`,
      trendUp: revenueTrend >= 0,
    },
  };

  // =========================
  // ⏱ AVG PROCESSING TIME
  // =========================

  const avgCurrent = avg(processingDaysCurrent);
  const avgPrev = avg(processingDaysPrev);

  const processingTrend = calcTrend(avgCurrent, avgPrev);

  const avgProcessingTime = {
    value: `${avgCurrent.toFixed(1)} days`,
    trend: {
      value: `${Math.abs(processingTrend).toFixed(0)}%`,
      trendUp: processingTrend <= 0, // lower is better
    },
  };

  // =========================
  // ✅ COMPLETION RATE
  // =========================

  const rateCurrent =
    totalCurrent === 0 ? 0 : (completedCurrent / totalCurrent) * 100;

  const ratePrev = totalPrev === 0 ? 0 : (completedPrev / totalPrev) * 100;

  const completionTrend = calcTrend(rateCurrent, ratePrev);

  const completionRate = {
    value: `${rateCurrent.toFixed(1)}%`,
    trend: {
      value: `${Math.abs(completionTrend).toFixed(0)}%`,
      trendUp: completionTrend >= 0,
    },
  };

  // =========================
  // FINAL RETURN
  // =========================

  return {
    totalRequests: requests.length,
    countByStatus,
    monthlyTrend,

    revenue,
    avgProcessingTime,
    completionRate,

    monthlyCounts,
    monthlyRevenue,
    documentTypeCounts,
  };
}

module.exports = { computeStats };
