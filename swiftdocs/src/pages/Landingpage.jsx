import { useState } from "react";
import Nav from "../layouts/Navigation";
import {
  GraduationCap,
  Activity,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  ShieldCheck,
  FileText,
  FileCheck,
  User,
  Clock,
  Check,
  Triangle,
  Square,
  Shield,
  Award,
  Hexagon,
  Octagon,
  MousePointerClick,
  UserCheck,
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import RequestModal from "../components/RequestModal";
import { requestEmailStatus } from "../services/request_service";
import Swal from "sweetalert2";

function Landingpage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!referenceNumber.trim()) return;

    setLoading(true);
    setError("");

    try {
      Swal.fire({
        title: "Processing Request",
        html: "Sending your email… please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: "#ffffff",
        backdrop: "rgba(15, 23, 42, 0.6)",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await requestEmailStatus(referenceNumber.trim());

      Swal.close();

      await Swal.fire({
        title: "Email Sent!",
        text: "Email has been sent to you. Please check your inbox.",
        icon: "success",
        confirmButtonText: "Got it",
        confirmButtonColor: "#16a34a",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl",
          confirmButton:
            "bg-green-600 hover:bg-green-700 text-white text-lg px-12 py-2 rounded-lg font-semibold shadow-lg transition-all",
          title: "text-xl font-bold",
          htmlContainer: "text-sm text-slate-600",
        },
      });
    } catch (err) {
      Swal.close();

      await Swal.fire({
        title: "Failed",
        text: err.message || "Failed to send tracking email",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#dc2626",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl",
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white text-lg px-12 py-2 rounded-lg font-semibold shadow-lg transition-all",
        },
      });

      setError(err.message || "Failed to send tracking email");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-sans text-slate-800 antialiased overflow-x-hidden">
      <Nav openRequestModal={openModal} />
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden hero-gradient">
        <div className="blob bg-(--primary-300) w-96 h-96 rounded-full top-0 left-0 mix-blend-multiply"></div>
        <div className="blob bg-purple-300 w-96 h-96 rounded-full top-0 right-0 mix-blend-multiply animation-delay-2000"></div>
        <div className="blob bg-pink-200 w-80 h-80 rounded-full -bottom-20 left-20 mix-blend-multiply animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className="text-center lg:text-left z-10 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--primary-50) border border-(--primary-100) text-(--primary-700) text-sm font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-(--primary-600) animate-pulse"></span>
                Now serving 1
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                School Documents <br />
                <span className="text-gradient">Without the Lines.</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Request transcripts, certificates, and clearances online. Track
                your application status in real-time and receive digital copies
                securely.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={openModal}
                  className="px-8 py-4 bg-(--primary-600) hover:bg-(--primary-700) text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-[0_20px_25px_-5px_rgba(59,130,246,0.35)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Request Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-semibold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5 text-(--primary-600)" />
                  See How It Works
                </a>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> 24/7
                  Access
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Secure &
                  Verified
                </div>
              </div>
            </div>

            <div
              className="relative lg:h-150 flex items-center justify-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-white rounded-2xl shadow-2xl p-2 border border-slate-100 z-20 animate-float">
                  <div className="bg-slate-50 rounded-xl overflow-hidden">
                    <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      </div>
                      <div className="ml-auto text-xs text-slate-400 font-mono">
                        swiftdocs.portal
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                          <div className="h-8 w-48 bg-slate-800 rounded"></div>
                        </div>
                        <div className="h-10 w-10 bg-(--primary-100) rounded-full flex items-center justify-center text-(--primary-600)">
                          <User className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-slate-200 rounded mb-1"></div>
                            <div className="h-2 w-16 bg-slate-100 rounded"></div>
                          </div>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                            PENDING
                          </span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="h-3 w-32 bg-slate-200 rounded mb-1"></div>
                            <div className="h-2 w-16 bg-slate-100 rounded"></div>
                          </div>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                            DONE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl z-30 animate-float"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Status Updated
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        Request Approved
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-5 -left-5 bg-(--primary-600) p-4 rounded-2xl shadow-xl z-30 text-white animate-float"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-(--primary-200) font-semibold uppercase">
                        Processing Time
                      </p>
                      <p className="text-lg font-bold">~2 Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Trusted by leading universities
          </p>
          <div className="flex justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Hexagon className="w-8 h-8 text-(--primary-600)" /> UniTech
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Triangle className="w-8 h-8 text-rose-600" /> State College
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Triangle className="w-8 h-8 text-amber-600" /> Global Inst.
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Square className="w-8 h-8 text-emerald-600" /> Global Metro Univ.
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800 md:flex">
              <Octagon className="w-8 h-8 text-blue-600" /> Global Academy
            </div>
          </div>
        </div>
      </div>

      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-(--primary-600) font-semibold tracking-wide uppercase text-sm mb-3">
              Why Choose Us
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to manage your credentials
            </h3>
            <p className="text-lg text-slate-600">
              We've digitized the entire process to save you time and effort. No
              more long lines or lost paperwork.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 card-hover border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-(--primary-100) rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-(--primary-600) mb-6 relative z-10">
                <MousePointerClick className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Simple Online Request
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Fill out the form in minutes from your phone or computer.
                Auto-save feature ensures you never lose your progress.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 card-hover border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-emerald-600 mb-6 relative z-10">
                <Activity className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Real-time Tracking
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Know exactly where your document is in the process. Get instant
                notifications when status changes.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 card-hover border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-rose-600 mb-6 relative z-10">
                <Shield className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Secure & Verified
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Built with bank-level encryption. Digital documents come with QR
                code verification for authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-24 bg-slate-900 text-white overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-(--primary-400) font-semibold tracking-wide uppercase text-sm mb-3">
                The Process
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Get your documents in 3 easy steps
              </h3>
              <p className="text-slate-400 text-lg mb-8">
                Our streamlined process ensures you spend less time worrying
                about paperwork and more time preparing for your future.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-(--primary-600) flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Choose Document</h4>
                    <p className="text-slate-400">
                      Select the type of credential you need from our list of
                      available documents.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Pay </h4>
                    <p className="text-slate-400">
                      Proceed to the cashier and present your reference number
                      to pay for the requested document. Once the payment is
                      confirmed by the cashier, your request will continue to
                      the processing stage.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4"></div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-lg">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Receive</h4>
                    <p className="text-slate-400">
                      Download digital copies instantly and receive physical
                      copies via mail.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-(--primary-600) to-violet-600 rounded-2xl opacity-30 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                alt="Student using laptop"
                className="relative rounded-2xl shadow-2xl border border-slate-700 w-full object-cover h-125"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="documents" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Available Documents
            </h3>
            <p className="text-lg text-slate-600">
              Request any of these official documents directly from the portal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">
                Official Transcript
              </h4>
              <p className="text-sm text-slate-500 mb-4">
                Complete academic record with official seal.
              </p>
              <span
                onClick={openModal}
                className="text-(--primary-600) text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Request
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Diploma Copy</h4>
              <p className="text-sm text-slate-500 mb-4">
                Certified true copy of your diploma.
              </p>
              <span
                onClick={openModal}
                className="text-(--primary-600) text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Request
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">
                Certificate of Enrollment
              </h4>
              <p className="text-sm text-slate-500 mb-4">
                Proof of current or past enrollment.
              </p>
              <span
                onClick={openModal}
                className="text-(--primary-600) text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Request
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">
                Good Moral Character
              </h4>
              <p className="text-sm text-slate-500 mb-4">
                Certification of conduct and standing.
              </p>
              <span
                onClick={openModal}
                className="text-(--primary-600) text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Request
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="track-request"
        className="py-28 bg-white relative overflow-hidden border-t border-slate-200"
      >
        {/* Background glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-175 h-h-175 bg-(--primary-200) rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT SIDE */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--primary-50) border border-(--primary-100) text-(--primary-700) text-sm font-semibold mb-6">
                <Activity className="w-4 h-4" />
                Real-time Tracking
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Instantly check the
                <span className="text-gradient"> status of your request</span>
              </h2>

              <p className="text-lg text-slate-600 mb-10 max-w-lg">
                Stay informed at every step. Enter your reference number and see
                exactly where your document is in the processing pipeline.
              </p>

              {/* benefits */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-slate-700 font-medium">
                    Instant status updates
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-slate-700 font-medium">
                    Secure and verified tracking
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-slate-700 font-medium">
                    Available 24/7 from any device
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE TRACKING UI */}
            <div className="relative">
              {/* glow */}
              <div className="absolute -inset-6 bg-linear-to-r from-(--primary-500) to-violet-500 rounded-3xl opacity-20 blur-2xl"></div>

              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
                {/* top bar */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>

                  <div className="ml-auto text-xs text-slate-400 font-mono">
                    request-tracker
                  </div>
                </div>

                {/* title */}
                <h4 className="text-xl font-bold text-slate-900 mb-4">
                  Enter Reference Number
                </h4>

                {/* input */}
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="REQ-2026-000123"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
                  />
                  <button
                    onClick={handleTrack}
                    disabled={loading}
                    className="px-6 py-4 bg-(--primary-600) hover:bg-(--primary-700) text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <Activity className="w-5 h-5" />
                    {loading ? "Loading..." : "Track"}
                  </button>
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                {/* example references */}
                <div className="mt-6">
                  <p className="text-sm text-slate-500 mb-2">
                    Example references
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      REQ-2026-000123
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      REQ-2026-000124
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      REQ-2026-000125
                    </span>
                  </div>
                </div>

                {/* helper */}
                <div className="mt-6 text-sm text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Reference number is sent to your email after submitting a
                  request.
                </div>
              </div>

              {/* floating status preview */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-52">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Latest Update</p>
                    <p className="text-sm font-bold text-slate-800">
                      Processing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-(--primary-700)"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to skip the registrar's line?
          </h2>
          <p className="text-(--primary-100) text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of students who are getting their documents faster
            and easier than ever before.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={openModal}
              className="px-8 py-4 bg-white text-(--primary-700) rounded-full font-bold text-lg hover:bg-(--primary-50) transition-colors shadow-xl"
            >
              Request Document
            </button>
            <button className="px-8 py-4 bg-(--primary-600) border border-(--primary-400) text-white rounded-full font-bold text-lg hover:bg-(--primary-500) transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group bg-slate-50 rounded-xl p-6 cursor-pointer open:bg-(--primary-50) open:ring-1 open:ring-(--primary-500) transition-all">
              <summary className="flex justify-between items-center font-medium text-slate-900 list-none">
                <span>How long does processing take?</span>
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <p className="text-slate-600 mt-4 group-open:animate-fade-in">
                Standard processing takes 3-5 business days. Express processing
                (24-48 hours) is available for an additional fee.
              </p>
            </details>

            <details className="group bg-slate-50 rounded-xl p-6 cursor-pointer open:bg-(--primary-50) open:ring-1 open:ring-(--primary-500) transition-all">
              <summary className="flex justify-between items-center font-medium text-slate-900 list-none">
                <span>Can I request documents for third parties?</span>
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                Yes, but you must provide a signed authorization letter and a
                valid ID of the document owner.
              </p>
            </details>

            <details className="group bg-slate-50 rounded-xl p-6 cursor-pointer open:bg-(--primary-50) open:ring-1 open:ring-(--primary-500) transition-all">
              <summary className="flex justify-between items-center font-medium text-slate-900 list-none">
                <span>What payment methods are accepted?</span>
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <p className="text-slate-600 mt-4">
                We accept credit/debit cards, GCash, PayMaya, and direct bank
                transfers.
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4 text-white">
                <GraduationCap className="w-6 h-6 text-(--primary-500)" />
                <span className="font-bold text-xl">SwiftDocs</span>
              </div>
              <p className="text-slate-400 max-w-xs">
                Making academic credential management seamless, secure, and
                accessible for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-(--primary-400) transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-(--primary-400) transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-(--primary-400) transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-(--primary-400) transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-(--primary-400) transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-(--primary-400) transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; 2026 SwiftDocs. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <RequestModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Landingpage;
