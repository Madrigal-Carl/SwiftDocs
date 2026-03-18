import { ChevronRight, FileText } from "lucide-react";
import { useAuth } from "../../stores/auth/auth_store";
import { getTabByRole } from "../../utils/role_tabs";

export default function WelcomeBanner({ onChangeTab }) {
  const { user } = useAuth();

  const targetTab = getTabByRole(user?.role);

  return (
    <div
      className="h-36 rounded-xl overflow-hidden relative"
      style={{ background: "var(--gradient-purple)" }}
    >
      <div className="absolute inset-0 opacity-20">
        <img
          src="http://static.photos/office/1200x630/42"
          alt="Campus"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-(--primary-900)/80 to-transparent"></div>

      <div className="relative h-full flex items-center justify-between px-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.fullname}!
          </h1>
          <p className="text-(--primary-100) text-sm">
            Here's what's happening with document requests today.
          </p>
          <button
            onClick={() => onChangeTab(targetTab)}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white text-(--primary-900) rounded-lg font-semibold text-sm hover:bg-(--primary-50) transition-colors shadow-lg"
          >
            View All Requests
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:block">
          <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
            <FileText className="w-12 h-12 text-white/90" />
          </div>
        </div>
      </div>
    </div>
  );
}
