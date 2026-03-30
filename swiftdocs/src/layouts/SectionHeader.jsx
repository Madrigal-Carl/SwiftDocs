import { Plus } from "lucide-react";

export default function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionExtra,
  icon: Icon = Plus,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-(--text-dark)">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actionExtra}

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className=" flex flex-row items-center px-6 py-3 bg-(--primary-600) text-white font-medium rounded-lg shadow-sm hover:bg-(--primary-700) transition"
          >
            <Icon className="w-4 h-4 mr-2" />

            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
