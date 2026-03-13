import Nav from "../components/navigation";

function Landingpage() {
  return (
    <div className="bg-linear-to-br from-[#150578] to-[#220E9D] min-h-dvh">
      <Nav />

      {/* Hero Section */}
      <section className="min-h-dvh flex items-center justify-center px-6">
        <div
          className="relative w-full max-w-400 h-[70dvh] rounded-[40px] 
        bg-linear-to-b from-[#150578] to-[#2B1DB4] 
        shadow-2xl flex flex-col items-center text-center 
        text-white px-10 p-24 mt-10"
        >
          {/* Small Label */}
          <p className="text-xl text-white/70 mb-4 mt-5">
            Credential Request Sytem
          </p>

          {/* Main Heading */}
          <h1 className="text-7xl font-semibold max-w-250 leading-tight">
            A Smarter Way to Request School Documents
          </h1>

          {/* Description */}
          <p className="mt-6 text-white/70 max-w-150">
            Submit your document requests online and track their progress in one
            simple platform.
          </p>

          {/* Buttons */}
          <div className="flex gap-6 mt-10">
            <button className="px-8 py-3 rounded-xl bg-white text-[#1E07AC] font-medium shadow hover:bg-[#1E07AC] hover:text-white transition">
              Request
            </button>

            <button className="px-8 py-3 rounded-xl border border-white text-white font-medium hover:bg-(--primary-light-purple) transition">
              Track Request
            </button>
          </div>

          {/* Bottom Right Button */}
          <button className="absolute bottom-8 right-8 px-8 py-3 rounded-xl bg-white text-[#1E07AC] font-medium shadow hover:bg-[#1E07AC] hover:text-white transition">
            Instructions
          </button>
        </div>
      </section>

      {/* White Content Section */}
      <section className="flex justify-center items-center min-h-dvh px-6 py-10">
        <div className="bg-white w-full max-w-420 min-h-[95dvh] rounded-[60px] p-16 shadow-xl">
          {/* Gradient Container */}
          <div className="bg-[#1E07AC]/20 border-4 border-[#6E6BC4] rounded-[50px] h-[72dvh] flex overflow-hidden mt-20">
            {/* LEFT SIDE */}
            <div className="w-[55%] bg-[#1E07AC]/40 p-16 flex flex-col justify-center border-r-[5px] border-[#6E6BC4] rounded-r-[50px]">
              <h1 className="text-6xl font-bold text-[#160B7A]">
                Track Request Status
              </h1>

              <p className="mt-6 text-sm text-[#160B7A]/80 max-w-125">
                Submit your document requests online and track their progress in
                one simple platform.
              </p>

              <button className="mt-8 bg-[#2C1AA6] text-white px-8 py-3 rounded-full w-fit font-medium">
                Instructions
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-[45%] flex flex-col justify-center items-center text-center p-16">
              <h2 className="text-3xl font-semibold text-[#160B7A]">
                Input Code
              </h2>

              <p className="text-xs text-[#160B7A]/60 mt-4 max-w-100">
                Enter the reference code.
              </p>

              <input
                type="text"
                placeholder="Enter reference code"
                className="mt-3 w-[320px] h-12.5 rounded-full px-6 bg-white shadow-inner outline-none"
              />

              <p className="text-xs text-[#160B7A]/60 mt-3">
                The reference code can be found on your request receipt.
              </p>

              <button className="mt-6 bg-[#2C1AA6] text-white px-8 py-3 rounded-full font-medium">
                Track Request
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landingpage;
