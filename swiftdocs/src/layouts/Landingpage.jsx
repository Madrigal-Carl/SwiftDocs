import Nav from "../components/navigation";

function Landingpage() {
  return (
    <div className="bg-linear-to-br from-[#150578] to-[#220E9D] min-h-dvh">
      <Nav variant="home"/>

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
              Instruction
            </button>
          </div>
        </div>
      </section>

      {/* White Content Section */}
      <section className="flex justify-center items-center min-h-dvh">
        <div className="bg-white w-full flex justify-center items-center min-h-dvh rounded-t-xl p-16 shadow-xl">
          {/* Gradient Container */}
          <div className="max-w-400 w-full bg-linear-to-b from-[#281891] to-[#150578] rounded-[50px] h-[75dvh]  flex overflow-hidden mt-20 shadow-2xl">
            {/* LEFT SIDE */}
            <div className="w-[55%] p-16 flex flex-col justify-center rounded-r-[50px]">
              <h1 className="text-6xl font-bold text-white">
                Track Request Status
              </h1>

              <p className="mt-6 text-lg text-white max-w-125">
                Submit your document requests online and track their progress in
                one simple platform.
              </p>

              <button className="mt-8 bg-[#2C1AA6] text-white px-8 py-3 rounded-full w-fit font-medium hover:bg-white hover:text-[#1E07AC] transition">
                Instruction
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-[45%] flex justify-center items-center">

              <div className="bg-white w-120 h-[50dvh]  rounded-[30px] shadow-xl flex flex-col items-center justify-center text-center p-10">

                <h2 className="text-2xl font-semibold text-[#160B7A]">
                  Input Code
                </h2>

                <p className="text-xs text-[#160B7A]/60 mt-3 max-w-65">
                  Enter the reference code you received after submitting your request to check its status.
                </p>

                <input
                  type="text"
                  placeholder="Enter reference code"
                  className="mt-6 w-full h-12 rounded-full px-6 bg-gray-100 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-800"
                />

                <p className="text-xs text-[#160B7A]/60 mt-3 max-w-65">
                  The reference code can be found on your request receipt.
                </p>

                <button className="mt-6 bg-[#2C1AA6] text-white px-8 py-3 rounded-full font-medium shadow-md hover:bg-(--primary-light-purple)">
                  Track Request
                </button>

              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landingpage;
