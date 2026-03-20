import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  CircleX,
  ArrowLeft,
  User,
  FileText,
  PhilippinePeso,
  Send,
  BookOpen,
  Book,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { fetchRequestByReference } from "../services/request_service.js";
import Loader from "../components/Loader";
import ProgressTracker from "../components/view/ProgressTracker.jsx";
import PaymentInformationCard from "../components/view/PaymentInformationCard.jsx";

export default function RequestView() {
  const { reference_number } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRequest = async () => {
      try {
        const data = await fetchRequestByReference(reference_number);
        setRequest(data);
      } catch (err) {
        console.error("Failed to fetch request:", err);
      } finally {
        setLoading(false);
      }
    };

    if (reference_number) getRequest();
  }, [reference_number]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            className="border border-(--border-light) p-2 rounded-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-(--text-dark) uppercase">
                {request.reference_number}
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Submitted on {request.request_date}</span>
            </div>
          </div>
        </div>

        {request.status !== "released" && request.status !== "rejected" && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-4 px-4 py-2 text-sm font-semibold rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
              <CircleX className="w-4 h-4" />
              Reject
            </button>
            <button className="flex items-center gap-4 px-4 py-2 text-sm font-semibold rounded-lg bg-(--primary-600) text-white hover:bg-(--primary-700) transition-colors shadow-sm">
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
          </div>
        )}
      </div>

      <ProgressTracker status={request.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Larger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Information Card */}
          <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-(--primary-100) flex items-center justify-center">
                <User className="w-4 h-4 text-(--primary-600)" />
              </div>
              <h3 className="font-semibold text-(--text-dark)">
                Student Information
              </h3>
            </div>

            {/* Student Details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Full Name
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {`${request.student.first_name} ${request.student.middle_name} ${request.student.last_name}${request.student.suffix ? `, ${request.student.suffix}` : ""}`}
                </p>
              </div>

              {/* Birth Date */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Birth Date
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {request.student.birth_date}
                </p>
              </div>

              {/* Sex */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Sex
                </p>
                <p className="text-sm font-medium text-(--text-dark) capitalize">
                  {request.student.sex}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-(--primary-600)">
                  {request.student.email}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Phone
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {request.student.phone_number}
                </p>
              </div>

              {/* Address (span full width) */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {request.student.address}
                </p>
              </div>
            </div>
          </div>

          {/* Education Information Card */}
          <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-(--primary-100) flex items-center justify-center">
                <Book className="w-4 h-4 text-(--primary-600)" />
              </div>
              <h3 className="font-semibold text-(--text-dark)">
                Education Information
              </h3>
            </div>

            {/* Education Details */}
            <div className="grid grid-cols-2 gap-4">
              {/* LRN */}
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  LRN
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {request.student.education.lrn}
                </p>
              </div>

              {/* Education Level */}
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Education Level
                </p>
                <p className="text-sm font-medium text-(--text-dark) capitalize">
                  {request.student.education.education_level}
                </p>
              </div>

              {/* Program */}
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Program
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {request.student.education.program}
                </p>
              </div>

              {/* School Last Attended */}
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  School Last Attended
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {request.student.education.school_last_attended}
                </p>
              </div>

              {/* Admission Date */}
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Admission Date
                </p>
                <p className="text-sm font-medium text-(--text-dark)">
                  {request.student.education.admission_date}
                </p>
              </div>

              {/* Completion Status */}
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Completion Status
                </p>
                <p className="text-sm font-medium text-(--text-dark) capitalize">
                  {request.student.education.completion_status}
                </p>
              </div>

              {/* Graduation Date (optional, span 1 col) */}
              {request.student.education.graduation_date && (
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Graduation Date
                  </p>
                  <p className="text-sm font-medium text-(--text-dark)">
                    {request.student.education.graduation_date}
                  </p>
                </div>
              )}

              {/* Attendance Period (optional, span 2 cols) */}
              {request.student.education.attendance_period && (
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Attendance Period
                  </p>
                  <p className="text-sm font-medium text-(--text-dark)">
                    {request.student.education.attendance_period}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Requested Document Card */}
          <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-(--primary-100) flex items-center justify-center">
                <FileText className="w-4 h-4 text-(--primary-600)" />
              </div>
              <h3 className="font-semibold text-(--text-dark)">
                Requested Documents
              </h3>
            </div>

            {(() => {
              const requestedDocs = request.requested_documents || [];
              const additionalDocs = request.additional_documents || [];

              const documents = requestedDocs.map((item) => ({
                type: item.document?.type,
                price: item.document?.price || 0,
                quantity: item.quantity || 0,
              }));

              const others = additionalDocs.map((item) => ({
                type: item.type,
                price: item.unit_price || 0,
                quantity: item.quantity || 0,
              }));

              const renderList = (list) =>
                list.map((doc, index) => {
                  const subtotal = doc.price * doc.quantity;

                  return (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-(--border-light)"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-(--text-dark) capitalize">
                          {doc.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₱{doc.price.toFixed(2)} × {doc.quantity}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">Subtotal</span>
                        <span className="font-semibold text-(--text-dark)">
                          ₱{subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                });

              const totalAmount = [...documents, ...others].reduce(
                (sum, doc) => sum + doc.price * doc.quantity,
                0,
              );

              return (
                <div className="space-y-6">
                  {/* DOCUMENTS */}
                  {documents.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Documents
                      </p>
                      <div className="border-t border-(--border-light) mb-3"></div>
                      <div className="space-y-3">{renderList(documents)}</div>
                    </div>
                  )}

                  {/* OTHERS */}
                  {others.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Others
                      </p>
                      <div className="border-t border-(--border-light) mb-3"></div>
                      <div className="space-y-3">{renderList(others)}</div>
                    </div>
                  )}

                  {/* Empty State */}
                  {documents.length === 0 && others.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No documents requested.
                    </p>
                  )}

                  {/* Notes */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Purpose / Notes
                    </p>
                    <p className="text-sm text-gray-600 bg-(--bg-light) p-3 rounded-lg">
                      {request.purpose}
                      {request.notes ? ` - ${request.notes}` : ""}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-3 border-t border-(--border-light)">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Total Payment
                    </span>
                    <span className="text-xl font-bold text-(--primary-600)">
                      ₱{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right Column - Smaller */}
        <div className="space-y-6">
          {/* Payment Information Card */}
          <PaymentInformationCard
            amount={[
              ...(request.requested_documents || []),
              ...(request.additional_documents || []),
            ].reduce((sum, doc) => {
              const price = doc.document?.price || doc.unit_price || 0;
              const quantity = doc.quantity || 0;
              return sum + price * quantity;
            }, 0)}
            status={request.status}
            proof={request.receipts?.map((r) => r.path) || []}
          />

          {/* Timeline Card */}
          {/* <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-(--primary-100) flex items-center justify-center">
                <Clock className="w-4 h-4 text-(--primary-600)" />
              </div>
              <h3 className="font-semibold text-(--text-dark)">
                Timeline
              </h3>
            </div>

            <div className="space-y-0">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-(--bg-light) flex items-center justify-center">
                      {getTimelineIcon(event.status)}
                    </div>
                    {index !== timelineEvents.length - 1 && (
                      <div className="w-0.5 flex-1 bg-(--border-light) my-1"></div>
                    )}
                  </div>
                  <div className="pb-4 last:pb-0">
                    <p className="text-sm font-semibold text-(--text-dark)">
                      {event.status}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                    <p className="text-xs text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/*  Notes Card */}
          {/* <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-(--primary-100) flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-(--primary-600)" />
              </div>
              <h3 className="font-semibold text-(--text-dark)">
                 Notes
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              {request.notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-(--bg-light) p-3 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-(--primary-600)">
                      {note.author}
                    </span>
                    <span className="text-xs text-gray-400">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-700">{note.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                className="w-full p-3 text-sm border border-(--border-light) rounded-lg bg-(--bg-light) focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] resize-none"
                rows="3"
              />
              <button
                onClick={handleAddNote}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-(--primary-600) text-white hover:bg-[var(--primary-700)] transition-colors"
              >
                <Send className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
