function computeStats(requests, timeframe = "year", role = "admin") {
  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const roleStatusMap = {
    rmo: ["under_review", "deficient", "paid", "invoiced", "released"],
    cashier: ["pending", "balance_due", "paid", "invoiced", "under_review"],
    admin: [
      "pending",
      "balance_due",
      "deficient",
      "under_review",
      "paid",
      "invoiced",
      "released",
      "rejected",
    ],
  };

  const allowedStatuses = roleStatusMap[role] || [];

  // Filter requests based on role's allowed statuses
  const filteredRequests = requests.filter((req) =>
    allowedStatuses.includes(req.status),
  );

  let startDate;
  if (timeframe === "week") {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);
  } else if (timeframe === "month") {
    startDate = new Date(currentYear, currentMonth, 1);
  } else {
    startDate = new Date(currentYear, 0, 1);
  }

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  const statuses = [
    "pending",
    "balance_due",
    "deficient",
    "under_review",
    "paid",
    "invoiced",
    "released",
    "rejected",
  ];

  const countByStatus = {};
  const monthlyTrend = {};

  allowedStatuses.forEach((status) => {
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
  // METRICS VARIABLES
  // =========================

  let revenueCurrent = 0;
  let revenuePrev = 0;
  let revenuePeriod = 0;

  let processingDaysCurrent = [];
  let processingDaysPrev = [];

  let completedCurrent = 0;
  let completedPrev = 0;

  let totalCurrent = 0;
  let totalPrev = 0;

  // =========================
  // AGGREGATIONS
  // =========================

  const monthlyCounts = {};
  const monthlyRevenue = {};
  const monthlyPaidReleasedCounts = {};

  // =========================
  // LOOP
  // =========================

  const paidReleasedRequests = [];

  filteredRequests.forEach((req) => {
    const status = req.status;
    const date = new Date(req.request_date);

    if (isNaN(date)) return;
    if (date < startDate || date > endDate) return;

    if (countByStatus[status] !== undefined) {
      countByStatus[status]++;
    }

    const isCurrent = date.getMonth() === currentMonth;
    const isPrev = date.getMonth() === prevMonth;

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
    // MONTH KEY
    // =========================

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;

    // =========================
    // REVENUE
    // =========================

    const isRevenueStatus = status === "paid" || status === "released";
    const totalPrice =
      req.total_price ??
      (typeof req.getGrandTotal === "function" ? req.getGrandTotal() : 0);

    if (isRevenueStatus && totalPrice) {
      revenuePeriod += totalPrice;
      if (isCurrent) revenueCurrent += totalPrice;
      if (isPrev) revenuePrev += totalPrice;

      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + totalPrice;
    }

    if (isRevenueStatus) {
      monthlyPaidReleasedCounts[monthKey] =
        (monthlyPaidReleasedCounts[monthKey] || 0) + 1;

      paidReleasedRequests.push({
        id: req.id,
        reference_number: req.reference_number,
        request_date: req.request_date,
        status: req.status,
        total_price:
          req.total_price ??
          (typeof req.getGrandTotal === "function" ? req.getGrandTotal() : 0),
        student:
          req.student && req.student.first_name
            ? `${req.student.first_name} ${req.student.middle_name || ""} ${req.student.last_name}`
                .replace(/\s+/g, " ")
                .trim()
            : "Unknown",
      });
    }

    // =========================
    // PROCESSING TIME
    // =========================

    if (req.request_completed) {
      const completedDate = new Date(req.request_completed);
      const diffDays = (completedDate - date) / (1000 * 60 * 60 * 24);

      if (isCurrent) processingDaysCurrent.push(diffDays);
      if (isPrev) processingDaysPrev.push(diffDays);
    }

    // =========================
    // COMPLETION RATE
    // =========================

    if (status === "released") {
      if (isCurrent) completedCurrent++;
      if (isPrev) completedPrev++;
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
  // TOTAL TREND
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
  // REVENUE
  // =========================

  const revenueTrend = calcTrend(revenueCurrent, revenuePrev);

  const revenue = {
    total: revenuePeriod,
    trend: {
      value: `${Math.abs(revenueTrend).toFixed(0)}%`,
      trendUp: revenueTrend >= 0,
    },
  };

  // =========================
  // AVG PROCESSING TIME
  // =========================

  const avgCurrent = avg(processingDaysCurrent);
  const avgPrev = avg(processingDaysPrev);
  const processingTrend = calcTrend(avgCurrent, avgPrev);

  const avgProcessingTime = {
    value: `${avgCurrent.toFixed(1)} days`,
    trend: {
      value: `${Math.abs(processingTrend).toFixed(0)}%`,
      trendUp: processingTrend <= 0,
    },
  };

  // =========================
  // COMPLETION RATE
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
  // MONTH FORMAT
  // =========================

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyPaidReleasedFormatted = Object.entries(monthlyPaidReleasedCounts)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([key, value]) => {
      let label = key;

      if (timeframe === "year") {
        const [, month] = key.split("-");
        label = monthNames[parseInt(month) - 1];
      } else {
        const dt = new Date(key);
        label = dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      return { period: label, requests: value };
    });

  const monthlyRequests = Object.entries(monthlyCounts)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([key, value]) => {
      let label = key;

      if (timeframe === "year") {
        const [, month] = key.split("-");
        label = monthNames[parseInt(month) - 1];
      } else {
        const dt = new Date(key);
        label = dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      return { month: label, requests: value };
    });

  const monthlyRevenueFormatted = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([key, value]) => {
      let label = key;

      if (timeframe === "year") {
        const [, month] = key.split("-");
        label = monthNames[parseInt(month) - 1];
      } else {
        const dt = new Date(key);
        label = dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      return { month: label, revenue: value };
    });

  const totalRequests = Object.values(monthlyCounts).reduce((a, b) => a + b, 0);

  // =========================
  // RETURN
  // =========================

  return {
    totalRequests,
    countByStatus,
    monthlyTrend,
    revenue,
    avgProcessingTime,
    completionRate,
    monthlyRequests,
    monthlyPaidReleasedRequests: monthlyPaidReleasedFormatted,
    monthlyRevenue: monthlyRevenueFormatted,
    paidReleasedRequests,
  };
}

module.exports = { computeStats };
