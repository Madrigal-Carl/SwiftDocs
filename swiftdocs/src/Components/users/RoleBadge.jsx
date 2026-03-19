export default function RoleBadge({ role }) {
  const styles = {
    rmo: "bg-cyan-100 text-cyan-700",
    cashier: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${styles[role] || "bg-gray-100 text-gray-700"}`}
    >
      {role}
    </span>
  );
}
