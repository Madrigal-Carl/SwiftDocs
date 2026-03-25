import AuthCard from "../components/AuthCard";
import { useNavigate } from "react-router-dom";
import { Activity, FileInput, ShieldCheck } from "lucide-react";
import logo from "../assets/white_outline_logo.png";

function AuthPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-linear-to-br from-[#1e3a8a] to-[#2563eb] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Top Logo */}
        <button
          className="flex items-center gap-3"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="SwiftDocs Logo" className="w-9" />
          <h1 className="text-xl font-semibold">SwiftDocs</h1>
        </button>

        {/* Main Content */}
        <div className="max-w-md">
          <h2 className="text-6xl font-bold leading-tight mb-4">
            Welcome to <br /> <span className="font-semibold">Swift</span>Docs
          </h2>

          <p className="text-white/80 mb-8">
            Request and track your school documents quickly and easily without
            the hassle of long queues.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl shadow-md flex items-center justify-center">
                <Activity className="w-7 h-7" />
              </div>
              <p className="font-semibold text-lg">Fast document requests</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl shadow-md flex items-center justify-center ">
                <FileInput className="w-7 h-7" />
              </div>
              <p className="font-semibold text-lg">
                Real-time request tracking
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl shadow-md flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <p className="font-semibold text-lg">Secure and simple process</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/60 text-sm">
          © 2026 SwiftDocs. All rights reserved.
        </p>

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-10 left-10 w-55 h-55 bg-white/10 rounded-full" />
        <div className="absolute bottom-10 left-10 w-45 h-45 bg-white/10 rounded-full" />
        <div className="absolute bottom-95 left-98 w-60 h-60 bg-white/10 rounded-full" />
        <div className="absolute bottom-100 left-100 w-50 h-50 bg-white/10 rounded-full" />
        <div className="absolute bottom-200 left-1 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute bottom-210 left-3 w-70 h-70 bg-white/10 rounded-full" />
        <div className="absolute top-200 right-1 w-120 h-120 bg-white/10 rounded-full" />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f0f4ff] p-6">
        <AuthCard />
      </div>
    </div>
  );
}

export default AuthPage;
