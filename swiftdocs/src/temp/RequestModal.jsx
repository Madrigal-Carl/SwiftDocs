import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  FileText,
  ShieldCheck,
  Database,
  Trash2,
  User,
  Lock,
  GraduationCap,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import { createRequest } from "../services/request_service";
import { getAllDocumentsNoPagination } from "../services/document_service";
import { showToast } from "../utils/swal";

function RequestModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    firstName: "",
    surname: "",
    middleName: "",
    suffix: "",
    gender: "",
    birthdate: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [academicInfo, setAcademicInfo] = useState({
    studentNumber: "",
    entryLevel: "",
    course: "",
    track: "",
    admissionDate: "",
    lastSchool: "",
    completion: "",
    graduationDate: "",
    attendanceYears: "",
    academicNotes: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    // Fetch documents from backend
    const fetchDocuments = async () => {
      try {
        const docs = await getAllDocumentsNoPagination();
        const formattedDocs = docs.map((doc) => ({
          ...doc,
          name: capitalizeWords(doc.type),
          defaultQuantity: 1,
        }));
        setAvailableDocuments(formattedDocs);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };

    fetchDocuments();
  }, [isOpen]);

  const progressWidth = useMemo(
    () => `${((currentStep - 1) / 4) * 100}%`,
    [currentStep],
  );

  const selectedDocIds = useMemo(
    () => selectedDocuments.map((d) => d.id),
    [selectedDocuments],
  );

  const filteredDocuments = useMemo(() => {
    if (!searchInput.trim()) return availableDocuments;
    const query = searchInput.trim().toLowerCase();
    return availableDocuments.filter((doc) =>
      doc.name.toLowerCase().includes(query),
    );
  }, [availableDocuments, searchInput]);

  const toggleDocument = (doc) => {
    const exists = selectedDocIds.includes(doc.id);
    if (exists) {
      setSelectedDocuments((prev) => prev.filter((item) => item.id !== doc.id));
      return;
    }
    setSelectedDocuments((prev) => [
      ...prev,
      { ...doc, quantity: doc.defaultQuantity || 1 },
    ]);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setSelectedDocuments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const addCustomDocument = () => {
    const name = searchInput.trim();
    if (!name) return;
    const newDoc = {
      id: Date.now(),
      name,
      defaultQuantity: 1,
      quantity: 1,
    };
    setAvailableDocuments((prev) => [...prev, newDoc]);
    setSelectedDocuments((prev) => [...prev, { ...newDoc, quantity: 1 }]);
    setSearchInput("");
  };

  const selectAll = (checked, docs = availableDocuments) => {
    if (checked) {
      const toAdd = docs
        .filter((doc) => !selectedDocIds.includes(doc.id))
        .map((doc) => ({ ...doc, quantity: doc.defaultQuantity || 1 }));
      setSelectedDocuments((prev) => [...prev, ...toAdd]);
      return;
    }
    if (docs === availableDocuments) {
      setSelectedDocuments([]);
      return;
    }
    setSelectedDocuments((prev) =>
      prev.filter((item) => !docs.some((doc) => doc.id === item.id)),
    );
  };

  const validateStep1 = () => agreed;
  const validateStep2 = () => selectedDocuments.length > 0;
  const validateStep3 = () => {
    const { firstName, surname, email, mobile, address } = studentInfo;
    return [firstName, surname, email, mobile, address].every(Boolean);
  };
  const validateStep4 = () => {
    const {
      studentNumber,
      entryLevel,
      course,
      track,
      completion,
      graduationDate,
      attendanceYears,
    } = academicInfo;
    const requiredFields = [studentNumber, entryLevel, completion];
    if (entryLevel === "College") requiredFields.push(course);
    if (entryLevel === "Senior High") requiredFields.push(track);
    if (completion === "Graduate") requiredFields.push(graduationDate);
    if (completion === "Undergraduate") requiredFields.push(attendanceYears);
    return requiredFields.every(Boolean);
  };

  const goToStep = (step) => {
    if (step === 2 && !validateStep1()) return;
    if (step === 3 && !validateStep2()) return;
    if (step === 4 && !validateStep3()) return;
    if (step === 5 && !validateStep4()) return;
    setCurrentStep(step);
  };

  const getStepClass = (step) => (step === currentStep ? "" : "hidden");

  const updateSummary = () => {
    const data = {
      documents: selectedDocuments,
      studentInfo,
      academicInfo,
    };
    return data;
  };

  const handleSubmit = async () => {
    try {
      const cleanPhoneNumber = studentInfo.mobile.replace(/\D/g, "");

      const payload = {
        first_name: studentInfo.firstName,
        middle_name: studentInfo.middleName,
        last_name: studentInfo.surname,
        birth_date: studentInfo.birthdate,
        sex: studentInfo.gender?.toLowerCase(),

        email: studentInfo.email,
        address: studentInfo.address,
        phone_number: cleanPhoneNumber,

        lrn: academicInfo.studentNumber,
        education_level: academicInfo.entryLevel?.toLowerCase(),

        school_last_attended: academicInfo.lastSchool,
        admission_date: academicInfo.admissionDate,

        completion_status: academicInfo.completion?.toLowerCase(),
        attendance_period: academicInfo.attendanceYears,

        program:
          academicInfo.entryLevel === "College"
            ? academicInfo.course
            : academicInfo.track,

        notes: academicInfo.academicNotes,

        purpose: purpose,

        documents: selectedDocuments.map((doc) => ({
          type: doc.name.toLowerCase(),
          quantity: doc.quantity,
        })),

        additionals: [],
      };

      await createRequest(payload);

      setFormSubmitted(true);

      showToast("success", "Request submitted successfully!");

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Submit failed:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit request";

      showToast("error", errorMessage);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setAgreed(false);
    setSearchInput("");
    setAvailableDocuments([]);
    setSelectedDocuments([]);
    setStudentInfo({
      firstName: "",
      surname: "",
      middleName: "",
      suffix: "",
      gender: "",
      birthdate: "",
      email: "",
      mobile: "",
      address: "",
    });
    setAcademicInfo({
      studentNumber: "",
      entryLevel: "",
      course: "",
      track: "",
      admissionDate: "",
      lastSchool: "",
      completion: "",
      graduationDate: "",
      attendanceYears: "",
      academicNotes: "",
    });
    setFormSubmitted(false);
  };

  if (!isOpen) return null;

  const summaryData = updateSummary();

  return (
    <div className="font-inter bg-linear-to-br from-primary-50 to-indigo-50 min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div className="glass-morphism max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-scale-in bg-white/90">
          <div className="border-b border-gray-100 bg-white/90 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Document Request Form
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
              >
                <X />
              </button>
            </div>
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
              <div
                className="absolute top-4 left-0 h-0.5 bg-(--primary-500) transition-all duration-300 -z-10"
                style={{ width: progressWidth }}
              />
              <div className="flex flex-col items-center">
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold " +
                    (currentStep === 1
                      ? "bg-(--primary-500) text-white"
                      : "bg-gray-200 text-gray-600")
                  }
                >
                  1
                </div>
                <span className="text-xs mt-2 font-medium text-gray-500">
                  Privacy
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold " +
                    (currentStep === 2
                      ? "bg-(--primary-500) text-white"
                      : "bg-gray-200 text-gray-600")
                  }
                >
                  2
                </div>
                <span className="text-xs mt-2 font-medium text-gray-500">
                  Documents
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold " +
                    (currentStep === 3
                      ? "bg-(--primary-500) text-white"
                      : "bg-gray-200 text-gray-600")
                  }
                >
                  3
                </div>
                <span className="text-xs mt-2 font-medium text-gray-500">
                  Student Info
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold " +
                    (currentStep === 4
                      ? "bg-(--primary-500) text-white"
                      : "bg-gray-200 text-gray-600")
                  }
                >
                  4
                </div>
                <span className="text-xs mt-2 font-medium text-gray-500">
                  Academic Info
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold " +
                    (currentStep === 5
                      ? "bg-(--primary-500) text-white"
                      : "bg-gray-200 text-gray-600")
                  }
                >
                  5
                </div>
                <span className="text-xs mt-2 font-medium text-gray-500">
                  Summary
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-auto max-h-[calc(90vh-140px)] p-6 scrollbar-thin">
            <div className={getStepClass(1)}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Privacy & Data Protection
              </h3>
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                <p className="text-gray-700 mb-4">
                  SwiftDocs collects personal and academic information only for
                  the purpose of processing document requests. Your data is
                  handled with the utmost care and security.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <ShieldCheck className="text-(--primary-500) mr-3 mt-1 shrink-0" />
                    <p className="text-gray-700">
                      Personal data will only be used for document processing
                      and institutional requirements.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Lock className="text-(--primary-500) mr-3 mt-1 shrink-0" />
                    <p className="text-gray-700">
                      Information will not be shared with unauthorized third
                      parties.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Database className="text-(--primary-500) mr-3 mt-1 shrink-0" />
                    <p className="text-gray-700">
                      Data is securely stored using encryption and protected
                      according to institutional policy.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Trash2 className="text-(--primary-500) mr-3 mt-1 shrink-0" />
                    <p className="text-gray-700">
                      Students may request deletion of their data after request
                      processing.
                    </p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto mb-6 scrollbar-thin">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Privacy Policy Agreement
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    By using SwiftDocs Document Request System, you acknowledge:
                  </p>
                  <p className="text-gray-600 text-sm ">
                    Pursuant to RA 10173 or the Data Privacy Act of 2012, we
                    recognize the importance of privacy and are committed to
                    maintaining the accuracy, confidentiality, and security of
                    your personal information. In filling out this form, you
                    understand that the information provided will be collected,
                    processed, protected, shared, retained and to be used by the
                    Informatics Records for its pursuits of legitimate purposes.
                    You, hereby allow Informatics Records - to collect, use and
                    share personal data for its pursuits of legitimate interests
                    as an educational institution. Informatics Records, agrees
                    to abide by all its rules, policies and regulations
                    pertaining to Data Privacy and confidentiality. This consent
                    and authorization remains valid and subsisting for a limited
                    period consistent with purposes or until otherwise revoked
                    or canceled in writing.
                  </p>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 mr-3 w-5 h-5 rounded border-gray-300 text-(--primary-600) focus:ring-(--primary-500)"
                  />
                  <label className="text-gray-700">
                    I have read and agree to the{" "}
                    <span className="text-(--primary-600) font-medium">
                      Privacy Policy
                    </span>{" "}
                    and{" "}
                    <span className="text-(--primary-600) font-medium">
                      Data Processing Terms
                    </span>
                    .
                  </label>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!agreed}
                  onClick={() => goToStep(2)}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(to right, var(--primary-500), var(--primary-600))",
                  }}
                >
                  Continue
                </button>
              </div>
            </div>

            <div className={getStepClass(2)}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Select Documents
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Request
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows="2"
                  placeholder="Enter purpose (e.g., employment, scholarship, transfer, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg min-h-15">
                {selectedDocuments.length === 0 ? (
                  <p className="text-gray-500">No documents selected yet.</p>
                ) : (
                  selectedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-(--primary-100) text-(--primary-700) px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {doc.name} ({doc.quantity})
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    type="text"
                    placeholder="Search for documents..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                  />
                  <Search className="absolute right-3 top-3.5 text-gray-400" />
                </div>
                <button
                  onClick={addCustomDocument}
                  className="px-4 py-3 bg-(--primary-50) text-(--primary-700) font-medium rounded-lg hover:bg-(--primary-100) transition-colors flex items-center"
                >
                  <PlusCircle className="mr-2" />
                  Add Document
                </button>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700 border-r border-gray-200 w-10">
                          <input
                            type="checkbox"
                            checked={
                              filteredDocuments.length > 0 &&
                              filteredDocuments.every((doc) =>
                                selectedDocIds.includes(doc.id),
                              )
                            }
                            onChange={(e) =>
                              selectAll(e.target.checked, filteredDocuments)
                            }
                            className="rounded border-gray-300 text-(--primary-600)"
                          />
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Document Name
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDocuments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-5 text-center text-gray-500"
                          >
                            No documents found matching "{searchInput}".
                          </td>
                        </tr>
                      ) : (
                        filteredDocuments.map((doc) => {
                          const selected = selectedDocIds.includes(doc.id);
                          const selectedItem = selectedDocuments.find(
                            (item) => item.id === doc.id,
                          );
                          const quantity = selected
                            ? (selectedItem?.quantity ?? 1)
                            : 0;
                          return (
                            <tr
                              key={doc.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 border-r border-gray-200">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleDocument(doc)}
                                  className="document-checkbox rounded border-gray-300 text-(--primary-600)"
                                />
                              </td>
                              <td className="px-4 py-3">{doc.name}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(doc.id, quantity - 1)
                                    }
                                    className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-(--primary-50)"
                                  >
                                    -
                                  </button>

                                  <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) =>
                                      updateQuantity(
                                        doc.id,
                                        Number(e.target.value) || 1,
                                      )
                                    }
                                    className="w-15 px-2 py-1 border border-gray-300 rounded-lg text-center"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!selected) toggleDocument(doc);
                                      else
                                        updateQuantity(
                                          doc.id,
                                          selectedItem.quantity + 1,
                                        );
                                    }}
                                    className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-(--primary-50)"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-700">
                                ₱
                                {(selected
                                  ? doc.price * quantity
                                  : 0
                                ).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => goToStep(1)}
                  className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors flex items-center"
                >
                  <ChevronLeft className="mr-2" />
                  Back
                </button>
                <button
                  onClick={() => goToStep(3)}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-md transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to right, var(--primary-500), var(--primary-600))",
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            <div className={getStepClass(3)}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ["First Name", "firstName", "text", "Enter first name"],
                  ["Surname", "surname", "text", "Enter surname"],
                  ["Middle Name", "middleName", "text", "Enter middle name"],
                  ["Suffix", "suffix", "text", "Jr., Sr., III, etc."],
                ].map(([label, field, type, placeholder]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      value={studentInfo[field]}
                      onChange={(e) =>
                        setStudentInfo((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      type={type}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="flex space-x-4">
                    {["Male", "Female"].map((gender) => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={studentInfo.gender === gender}
                          onChange={(e) =>
                            setStudentInfo((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                          className="mr-2 text-(--primary-600) focus:ring-(--primary-500)"
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    value={studentInfo.birthdate}
                    onChange={(e) =>
                      setStudentInfo((prev) => ({
                        ...prev,
                        birthdate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={studentInfo.email}
                    onChange={(e) =>
                      setStudentInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={studentInfo.mobile}
                    onChange={(e) =>
                      setStudentInfo((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                    placeholder="+63 912 345 6789"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address
                  </label>
                  <textarea
                    value={studentInfo.address}
                    onChange={(e) =>
                      setStudentInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                    placeholder="Enter complete address including street, city, province, zip code"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => goToStep(2)}
                  className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors flex items-center"
                >
                  <ChevronLeft className="mr-2" />
                  Back
                </button>
                <button
                  onClick={() => goToStep(4)}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-md transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to right, var(--primary-500), var(--primary-600))",
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            <div className={getStepClass(4)}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  [
                    "LRN No / Student Number",
                    "studentNumber",
                    "text",
                    "Enter student number",
                  ],
                  ["Academic Entry Level", "entryLevel", "radio", ""],
                  [
                    "Admission Date (Term & School Year)",
                    "admissionDate",
                    "text",
                    "e.g., T2 2020-2021",
                  ],
                  [
                    "Name of School Last Attended",
                    "lastSchool",
                    "text",
                    "Enter school name",
                  ],
                  [
                    "Course / Degree",
                    "course",
                    "text",
                    "e.g., BS Computer Science",
                  ],
                  ["Track / Strand", "track", "text", "e.g., STEM, ABM, HUMSS"],
                  [
                    "Date of Graduation (Full date)",
                    "graduationDate",
                    "date",
                    "",
                  ],
                  [
                    "Inclusive Years of Attendance",
                    "attendanceYears",
                    "text",
                    "e.g., 2020-2024",
                  ],
                ].map(([label, field, type, placeholder]) => {
                  if (field === "entryLevel") {
                    return (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {label}
                        </label>
                        <div className="space-y-2">
                          {["Senior High", "College"].map((value) => (
                            <label key={value} className="flex items-center">
                              <input
                                type="radio"
                                name="entryLevel"
                                value={value}
                                checked={academicInfo.entryLevel === value}
                                onChange={(e) =>
                                  setAcademicInfo((prev) => ({
                                    ...prev,
                                    entryLevel: e.target.value,
                                  }))
                                }
                                className="mr-2 text-(--primary-600) focus:ring-(--primary-500)"
                              />
                              {value}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (field === "completion") return null;
                  if (
                    field === "course" &&
                    academicInfo.entryLevel !== "College"
                  )
                    return null;
                  if (
                    field === "track" &&
                    academicInfo.entryLevel !== "Senior High"
                  )
                    return null;
                  if (
                    field === "graduationDate" &&
                    academicInfo.completion !== "Graduate"
                  )
                    return null;
                  if (
                    field === "attendanceYears" &&
                    academicInfo.completion !== "Undergraduate"
                  )
                    return null;
                  return (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <input
                        value={academicInfo[field]}
                        onChange={(e) =>
                          setAcademicInfo((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        type={type}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                      />
                    </div>
                  );
                })}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Completion
                  </label>
                  <div className="space-y-2">
                    {["Graduate", "Undergraduate"].map((value) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="radio"
                          name="completion"
                          value={value}
                          checked={academicInfo.completion === value}
                          onChange={(e) =>
                            setAcademicInfo((prev) => ({
                              ...prev,
                              completion: e.target.value,
                            }))
                          }
                          className="mr-2 text-(--primary-600) focus:ring-(--primary-500)"
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={academicInfo.academicNotes}
                  onChange={(e) =>
                    setAcademicInfo((prev) => ({
                      ...prev,
                      academicNotes: e.target.value,
                    }))
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus focus:outline-none focus:border-(--primary-400)"
                  placeholder="Any additional information about academic history"
                ></textarea>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => goToStep(3)}
                  className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors flex items-center"
                >
                  <ChevronLeft className="mr-2" />
                  Back
                </button>
                <button
                  onClick={() => goToStep(5)}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-md transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to right, var(--primary-500), var(--primary-600))",
                  }}
                >
                  Review Request
                </button>
              </div>
            </div>

            <div className={getStepClass(5)}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Review Your Request
              </h3>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="mr-2 text-(--primary-500)" />
                    Documents Requested
                  </h4>
                  <ul id="summaryDocuments" className="space-y-2 pl-5">
                    {summaryData.documents.length === 0 ? (
                      <li className="text-gray-500">No documents selected.</li>
                    ) : (
                      summaryData.documents.map((doc) => (
                        <li key={doc.id}>
                          {doc.name} {doc.quantity}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="mr-2 text-(--primary-500)" />
                    Student Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p id="summaryName" className="font-medium">
                        {`${studentInfo.firstName || "-"} ${studentInfo.surname || ""}`.trim() ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p id="summaryEmail" className="font-medium">
                        {studentInfo.email || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p id="summaryMobile" className="font-medium">
                        {studentInfo.mobile || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p id="summaryAddress" className="font-medium">
                        {studentInfo.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <GraduationCap className="mr-2 text-(--primary-500)" />
                    Academic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Student Number</p>
                      <p id="summaryStudentNumber" className="font-medium">
                        {academicInfo.studentNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Entry Level</p>
                      <p id="summaryEntryLevel" className="font-medium">
                        {academicInfo.entryLevel || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Program</p>
                      <p id="summaryProgram" className="font-medium">
                        {academicInfo.entryLevel === "College"
                          ? academicInfo.course || "-"
                          : academicInfo.entryLevel === "Senior High"
                            ? academicInfo.track || "-"
                            : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Admission Date</p>
                      <p id="summaryAdmissionDate" className="font-medium">
                        {academicInfo.admissionDate || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Last School Attended
                      </p>
                      <p id="summaryLastSchool" className="font-medium">
                        {academicInfo.lastSchool || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Course Completion</p>
                      <p id="summaryCompletion" className="font-medium">
                        {academicInfo.completion || "-"}
                      </p>
                    </div>
                    {academicInfo.completion === "Graduate" ? (
                      <div>
                        <p className="text-sm text-gray-500">
                          Date of Graduation
                        </p>
                        <p id="summaryGraduationDate" className="font-medium">
                          {academicInfo.graduationDate || "-"}
                        </p>
                      </div>
                    ) : academicInfo.completion === "Undergraduate" ? (
                      <div>
                        <p className="text-sm text-gray-500">Years Attended</p>
                        <p id="summaryYears" className="font-medium">
                          {academicInfo.attendanceYears || "-"}
                        </p>
                      </div>
                    ) : null}
                    {academicInfo.academicNotes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Notes</p>
                        <p id="summaryNotes" className="font-medium">
                          {academicInfo.academicNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => goToStep(4)}
                  className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors flex items-center"
                >
                  <ChevronLeft className="mr-2" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-md transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to right, var(--primary-500), var(--primary-600))",
                  }}
                >
                  Submit Request
                </button>
              </div>
            </div>

            {formSubmitted && (
              <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3 text-green-700 text-sm">
                Request submitted successfully. Closing shortly...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestModal;
