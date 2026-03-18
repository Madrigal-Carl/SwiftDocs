export default function ContentHeader({ title, description }) {
  return (
    <div className="mb-2">
      <h1 className="text-2xl font-bold text-(--text-dark)">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
}
