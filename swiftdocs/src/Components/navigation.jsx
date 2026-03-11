import Logo from "../assets/swiftlogo.svg";

function Navigation() {
  return (
    <nav className="border border-gray-200 flex items-center justify-between px-6 py-2 bg-[var(--gradiant-purple)] rounded-[var(--radius-2xl)] text-white w-[80%] mx-auto mt-6">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="SwiftDocs Logo" className="bg-gray-300 rounded-full"/>
        <h1 className="text-2xl tracking-wide">
            <span className="font-bold">Swift</span>Docs
        </h1>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-10">
        <ul className="flex gap-8 text-md font-medium">
          <li className="cursor-pointer hover:text-gray-400 transition">Request</li>
          <li className="cursor-pointer hover:text-gray-400 transition">Monitor</li>
          <li className="cursor-pointer hover:text-gray-400 transition">Services</li>
          <li className="cursor-pointer hover:text-gray-400 transition">About Us</li>
        </ul>

        {/* Button */}
        <button className="border border-white-300 bg-[var(--primary-teal)] px-5 py-2 rounded-lg font-medium hover:bg-[var(--primary-light-purple)] transition">
          Get Started
        </button>
      </div>

    </nav>
  );
}

export default Navigation;