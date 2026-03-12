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
        <div className="bg-white w-[100%] max-w-[1600px] min-h-[98vh] rounded-[40px] p-16 shadow-xl">
             
            <div className="bg-[#1E07AC]/12%"></div>

        </div>
        </section>

    </div>
  );
}

export default Landingpage;