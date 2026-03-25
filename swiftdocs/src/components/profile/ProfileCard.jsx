import { useAuth } from "../../stores/auth_store";
import { Shield, Calendar, Check } from "lucide-react";

export default function userCard() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.initials;

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return (
    <div className="bg-white rounded-xl border border-(--border-light) shadow-sm overflow-hidden">
      <div className="h-24 bg-linear-to-r from-(--primary-600) to-(--primary-800)"></div>
      <div className="px-6 pb-6">
        <div className="relative flex justify-center">
          <div className="absolute -top-12 w-24 h-24 rounded-full bg-linear-to-br from-(--primary-400) to-(--primary-600) flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
            {initials}
          </div>
        </div>
        <div className="mt-14 text-center">
          <h3 className="text-xl font-bold text-(--text-dark)">
            {user.fullname}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-(--primary-100) text-(--primary-700) border border-(--primary-200)  uppercase">
              <Shield className="w-3 h-3 mr-1" />
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-(--border-light) space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Account Created</span>
            </div>
            <span className="font-medium text-(--text-dark)">{createdAt}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Check className="w-4 h-4" />
              <span>Status</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 capitalize">
              {user.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
