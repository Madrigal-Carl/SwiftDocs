import Logo from "../assets/swiftlogo.svg";

function Navigation({ variant = "default", menu = "main" }) {

  const variants = {
    home: "bg-(--primary-purple) text-white border-white/40",
    privacy: "bg-gray-200 text-[var(--primary-purple)] border-gray-300 backdrop-blur-md bg-white/80 w-[90%] mt-12",
    default: "bg-(--primary-purple) text-white border-white/20",
  };

  return (
    <nav
      className={`
        fixed left-1/2 -translate-x-1/2 z-50
        border flex items-center justify-between
        px-4 py-2 rounded-[80px]
        w-[84%] mx-auto mt-8 transition
        ${variants[variant]}
      `}
    >

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src={Logo}
          alt="SwiftDocs Logo"
          className="bg-gray-300 rounded-full"
        />

        <h1 className="text-2xl tracking-wide">
          <span className="font-bold">Swift</span>Docs
        </h1>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-10">

        {menu === "privacy" ? (
          <ul className="flex gap-8 text-lg font-medium">
            <li className="cursor-pointer hover:opacity-70">Home</li>
            <li className="cursor-pointer hover:opacity-70">How it Works</li>
          </ul>
        ) : (
          <>
            <ul className="flex gap-8 text-lg font-medium">
              <li className="cursor-pointer hover:text-gray-400">Request</li>
              <li className="cursor-pointer hover:text-gray-400">Monitor</li>
              <li className="cursor-pointer hover:text-gray-400">Services</li>
              <li className="cursor-pointer hover:text-gray-400">About Us</li>
            </ul>

            <button className="border border-white/30 px-5 py-3 rounded-4xl font-medium hover:bg-(--primary-light-purple) transition">
              Staff Login
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navigation;