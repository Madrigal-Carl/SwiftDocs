export function getMonthlyTrend(requests, status = null) {
  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const filterFn = (item) => {
    const req = item.request;
    if (!req) return false;

    if (status && req.status !== status) return false;

    return true;
  };

  const currentCount = requests.filter((item) => {
    if (!filterFn(item)) return false;
    const date = new Date(item.request.request_date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const prevCount = requests.filter((item) => {
    if (!filterFn(item)) return false;
    const date = new Date(item.request.request_date);
    return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
  }).length;

  // ✅ compute %
  let trend = 0;
  if (prevCount === 0) {
    trend = currentCount === 0 ? 0 : 100;
  } else {
    trend = ((currentCount - prevCount) / prevCount) * 100;
  }

  return {
    value: `${Math.abs(trend).toFixed(0)}%`,
    trendUp: trend >= 0,
  };
}
