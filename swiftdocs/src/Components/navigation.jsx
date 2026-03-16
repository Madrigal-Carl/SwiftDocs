import { GraduationCap, Menu } from "lucide-react";

function Navigation({ variant = "default", menu = "main" }) {
  return (
    <nav
      className="fixed w-full z-50 glass-nav transition-all duration-300"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Edu<span className="text-indigo-600">Credentials</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              How it Works
            </a>
            <a
              href="#documents"
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Documents
            </a>
            <a
              href="#faq"
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-slate-600 hover:text-indigo-600 font-medium px-4 py-2 transition-colors">
              Log in
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transform hover:-translate-y-0.5">
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-btn"
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className="hidden md:hidden bg-white border-t border-slate-100 absolute w-full"
      >
        <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
          <a
            href="#features"
            className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
          >
            How it Works
          </a>
          <a
            href="#documents"
            className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
          >
            Documents
          </a>
          <div className="pt-4 flex flex-col gap-3">
            <button className="w-full text-center py-3 border border-slate-200 rounded-xl font-medium text-slate-700">
              Log in
            </button>
            <button className="w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
