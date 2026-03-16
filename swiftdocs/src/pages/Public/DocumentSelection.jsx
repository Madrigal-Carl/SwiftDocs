import { useState } from "react";
import Navigation from "../../components/navigation";
import { PlusCircle } from "lucide-react" 

function DocumentSelection() {
  const documents = [
    { id: 1, name: "DIPLOMA (for 2nd Copy, provide affidavit of loss)", price: 300 },
    { id: 2, name: "TRANSCRIPT OF RECORDS", price: 500 },
    { id: 3, name: "TRUE COPY OF GRADES", price: 200 },
    { id: 4, name: "FORM 137 (for SHS only)", price: 200 },
    { id: 5, name: "FORM 138 (for SHS only)", price: 200 },
    { id: 6, name: "HONORABLE DISMISSAL (with TOR to be sent to requesting school)", price: 1000 },
    { id: 7, name: "CERTIFICATE OF GOOD MORAL", price: 200},
    { id: 8, name: "CTC (CERTIFIED TRUE COPY) /document", price: 100},
    { id: 9, name: "CERTIFICATE OF HONOR / AWARDS", price: 250},
    { id: 10, name: "COURSE DESCRIPTION - ₱200/page (₱50 per succeeding page)", price: 200},
    { id: 11, name: "CERTIFICATE OF GRADES - ₱200/page (₱50 per succeeding page)", price: 200},
    { id: 12, name: "WES APPLICATION - ₱4000 (including international courier fee via DHL)", price: 4000},
    { id: 13, name: "CAV APPLICATION -(processing & CTC)", price: 500},
    { id: 14, name: "OTHER CERTIFICATES ", price: 200},
  ];

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDocument = (doc) => {
    const exists = selectedDocs.find((d) => d.id === doc.id);
    if (exists) {
      setSelectedDocs(selectedDocs.filter((d) => d.id !== doc.id));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  // Filtered documents based on search
  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [quantities, setQuantities] = useState({});

  return (
    <>
      <Navigation variant="privacy" menu="privacy" />

      <div className="min-h-screen bg-gray-300 flex justify-center ">
        <section className="w-full max-w-450 max-h-screen bg-linear-to-b from-[#2B1BA7] to-[#0D0460] rounded-t-[40px] px-6 pt-36 text-white flex flex-col justify-center items-center mt-4">

          {/* Selected Documents */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-6 min-h-15">
            {selectedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-gray-200 text-[#1E07AC] px-4 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                {doc.name}
                <button
                  onClick={() => toggleDocument(doc)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
          ))}
          </div>

          {/* Top Row: Search + Add + Next */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border flex-1 px-3 py-2 rounded-md text-white focus:outline-none max-w-60"
            />
            <button
              onClick={() => {}}
              className="border bg-transparent text-white px-4 py-2 rounded-md text-md font-semibold flex items-center gap-2"
            >
              <PlusCircle/> ADD
            </button>
            <button
              onClick={() => {}}
              className="bg-green-500 px-4 py-2 rounded-md "
            >
              NEXT
            </button>
          </div>


            {/* Table */}
            <div className="bg-gray-200 text-[#1E07AC] rounded-2xl p-6 max-h-155 flex flex-col max-w-395 w-full">
            {/* Scrollable body wrapper */}
            <div className="overflow-y-auto flex-1">
                <table className="w-full table-fixed border-collapse">
                {/* Table Head */}
                <thead className="sticky top-0 bg-gray-200 z-10 text-2xl border-b-2">
                    <tr className="text-left font-semibold">
                    <th className="w-7/12 px-3 py-2">Documents</th>
                    <th className="w-3/12 px-3 py-2 text-center">Quantity</th>
                    <th className="w-2/12 px-3 py-2 text-right">Prices</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {filteredDocs.map((doc) => {
                    const checked = selectedDocs.find((d) => d.id === doc.id);
                    return (
                        <tr key={doc.id} className= "mb-1">
                        <td className="px-3 py-2 flex items-center gap-3 text-lg">
                            <input
                            type="checkbox"
                            checked={!!checked}
                            onChange={() => toggleDocument(doc)}
                            className="w-4 h-4"
                            />
                            <span>{doc.name}</span>
                        </td>

                        <td className="px-3 py-2 text-center text-lg">
                            <input
                            type="number"
                            min=""
                            value={quantities[doc.id] || ""}
                            onChange={(e) =>
                                setQuantities({
                                ...quantities,
                                [doc.id]: parseInt(e.target.value) || 1,
                                })
                            }
                            className="w-12 h-8 rounded-md bg-gray-300 text-center text-(--primary-purple) focus:outline-none"
                            /> 
                        </td>

                        <td className="px-3 py-2 text-right text-lg">
                            ₱{(doc.price * (quantities[doc.id] || 1)).toLocaleString()}
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </div>
            </div>

        </section>
      </div>
    </>
  );
}

export default DocumentSelection;