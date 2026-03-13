import Logo from "../assets/swiftlogo.svg";

function Navigation() {
  return (
    <nav className="fixed left-1/2 -translate-x-1/2 z-50 order border border-white-200 flex items-center justify-between px-4 py-2 bg-(--primary-purple) rounded-[80px] text-white w-[84%] mx-auto mt-8">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="SwiftDocs Logo" className="bg-gray-300 rounded-full"/>
        <h1 className="text-2xl tracking-wide">
            <span className="font-bold">Swift</span>Docs
        </h1>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-10">
        <ul className="flex gap-8 text-lg font-medium">
          <li className="cursor-pointer hover:text-gray-400 transition">Request</li>
          <li className="cursor-pointer hover:text-gray-400 transition">Monitor</li>
          <li className="cursor-pointer hover:text-gray-400 transition">Services</li>
          <li className="cursor-pointer hover:text-gray-400 transition">About Us</li>
        </ul>

        {/* Button */}
        <button className="border border-white-300 bg-(--primary-purple-dark) px-5 py-3 rounded-4xl font-medium hover:bg-(--primary-light-purple) transition">
          Staff Login
        </button>
      </div>

    </nav>
  );
}

export default Navigation;