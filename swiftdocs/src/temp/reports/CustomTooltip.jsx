export default function CustomTooltip({
  active,
  payload,
  label,
  valuePrefix = "",
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-(--border-light) rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-900 mb-1">{label}</p>
        <p className="text-sm text-(--primary-600) font-semibold">
          {valuePrefix}
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}
