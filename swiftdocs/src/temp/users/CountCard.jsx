export default function CountCard({ title, value, icon: Icon, colorClass }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    cyan: "bg-cyan-50 text-cyan-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-(--text-dark)">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[colorClass] || colorClasses.blue}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
