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
      if (perStatusCurrent[status] !== undefined) {
        perStatusCurrent[status]++;
      }
    }

    if (isPrev) {
      prevAll++;
      if (perStatusPrev[status] !== undefined) {
        perStatusPrev[status]++;
      }
    }
  });

  function calcTrend(curr, prev) {
    if (prev === 0) return curr === 0 ? 0 : 100;
    return ((curr - prev) / prev) * 100;
  }

  // total trend
  const totalTrend = calcTrend(currentAll, prevAll);

  monthlyTrend["all"] = {
    value: `${Math.abs(totalTrend).toFixed(0)}%`,
    trendUp: totalTrend >= 0,
  };

  // per status trend
  statuses.forEach((status) => {
    const trend = calcTrend(perStatusCurrent[status], perStatusPrev[status]);

    monthlyTrend[status] = {
      value: `${Math.abs(trend).toFixed(0)}%`,
      trendUp: trend >= 0,
    };
  });

  return {
    totalRequests: requests.length,
    countByStatus,
    monthlyTrend,
  };
}

module.exports = { computeStats };
