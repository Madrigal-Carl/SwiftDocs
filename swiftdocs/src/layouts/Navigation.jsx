import { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/colored_logo.png";

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav
      className="fixed w-full z-50 glass-nav transition-all duration-300"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="shrink-0 flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="SwiftDocs Logo" className="w-9" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Swift<span className="text-(--primary-600)">Docs</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-(--primary-600) font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-(--primary-600) font-medium transition-colors"
            >
              How it Works
            </a>
            <a
              href="#documents"
              className="text-slate-600 hover:text-(--primary-600) font-medium transition-colors"
            >
              Documents
            </a>
            <a
              href="#track-request"
              className="text-slate-600 hover:text-(--primary-600) font-medium transition-colors"
            >
              Track Request
            </a>
            <a
              href="#faq"
              className="text-slate-600 hover:text-(--primary-600) font-medium transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/auth")}
              className="text-slate-600 hover:text-(--primary-600) font-medium px-4 py-2 transition-colors"
            >
              Log in
            </button>
            <button className="bg-(--primary-600) hover:bg-(--primary-700) text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-[0_10px_25px_rgba(59,130,246,0.45)] transform hover:-translate-y-0.5">
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white border-t border-slate-100 z-50 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-(--primary-600) hover:bg-(--primary-50)"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-(--primary-600) hover:bg-(--primary-50)"
            >
              How it Works
            </a>
            <a
              href="#documents"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-(--primary-600) hover:bg-(--primary-50)"
            >
              Documents
            </a>
            <a
              href="#track-request"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-(--primary-600) hover:bg-(--primary-50)"
            >
              Track Request
            </a>
            <div className="pt-4 flex flex-col gap-3">
              <button className="w-full text-center py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:text-(--primary-600) transition-colors">
                Log in
              </button>
              <button className="w-full text-center py-3 bg-(--primary-600) text-white rounded-xl font-medium shadow-lg hover:bg-(--primary-700) transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
