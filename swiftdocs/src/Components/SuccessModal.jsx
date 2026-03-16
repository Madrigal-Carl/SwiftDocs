function SuccessModal() {
  <div
    id="successModal"
    className="fixed inset-0 bg-black/60 hidden items-center justify-center p-4 z-50"
  >
    <div className="glass-morphism max-w-md w-full rounded-2xl shadow-2xl p-8 animate-scale-in">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i
            data-lucide="check-circle"
            className="text-green-500 w-10 h-10"
          ></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Request Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-6">
          Your document request has been successfully submitted. You will
          receive an email confirmation shortly with your request details and
          tracking number.
        </p>
        <button
          id="closeSuccessModalBtn"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:shadow-md transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>;
}

export default SuccessModal;
