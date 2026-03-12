import Nav from "../Components/navigation";

function Landingpage() {
  return (
    <div className="bg-gradient-to-br from-[#150578] to-[#220E9D] min-h-screen">

      <Nav />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-5xl font-bold">
          A Smarter Way to Request School Documents
        </h1>
      </section>

        {/* White Content Section */}
        <section className="flex justify-center items-center min-h-screen">
            <div className="bg-white w-[100%] max-w-[1600px] min-h-[98vh] rounded-[60px] p-16 shadow-xl">

                {/* Gradient Container */}
                <div className="bg-[#1E07AC]/20 border-4 border-[#6E6BC4] rounded-[50px] h-[48rem] flex overflow-hidden mt-20">

                {/* LEFT SIDE */}
                <div className="w-[55%] bg-[#1E07AC]/40 p-16 flex flex-col justify-center border-r-5 border-[#6E6BC4]  rounded-r-[50px]">

                    <h1 className="text-6xl font-bold text-[#160B7A]">
                    Track Request Status
                    </h1>

                    <p className="mt-6 text-xm text-[#160B7A]/80 max-w-[500px]">
                    Submit your document requests online and track their progress
                    in one simple platform.
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

                    <p className="text-xs text-[#160B7A]/60 mt-4 max-w-[400px]">
                    Enter the reference code.
                    </p>

                    <input
                    type="text"
                    placeholder="Enter reference code"
                    className="mt-2 w-[320px] h-[50px] rounded-full px-6 bg-white shadow-inner outline-none"
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