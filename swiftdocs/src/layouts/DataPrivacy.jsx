import Navigation from "../components/navigation";

function DataPrivacy() {
  return (
    <>
      <Navigation variant="privacy" menu="privacy" />

      <div className="min-h-screen bg-gray-300 flex justify-center">

        <section
          className="w-full max-w-450 max-h-screen bg-linear-to-b from-[#2B1BA7] to-[#0D0460] rounded-t-[40px] px-20 pt-36 pb-20 text-white flex flex-col mt-4"
        >
          <h1 className="mt-30 text-5xl font-semibold mb-8">
            Data Privacy Declaration
          </h1>

          <p className="text-gray-200 leading-relaxed text-xl text-justify max-w-400">
            Pursuant to RA 10173 or the Data Privacy Act of 2012, we recognize
            the importance of privacy and are committed to maintaining the
            accuracy, confidentiality, and security of your personal
            information. In filling out this form, you understand that the
            information provided will be collected, processed, protected,
            shared, retained and to be used by the Informatics Records for its
            pursuits of legitimate purposes. You hereby allow Informatics
            Records to collect, use and share personal data for its pursuits of
            legitimate interests as an educational institution. Informatics
            Records agrees to abide by all its rules, policies and regulations
            pertaining to Data Privacy and confidentiality.
          </p>

          {/* Agreement */}
          <label className="flex items-center gap-3 mt-10 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-white"
            />

            <span className="text-lg">
              I agree to the Data Privacy Declaration
            </span>
          </label>

          {/* Bottom Right Button */}
          <div className="mt-auto flex justify-end">
            <button className="mt-6 bg-white text-(--primary-purple) px-8 py-3 rounded-full font-medium shadow-md hover:bg-(--primary-purple) hover:text-white transition">
              Agree and Continue
            </button>
          </div>

        </section>
      </div>
    </>
  );
}

export default DataPrivacy;