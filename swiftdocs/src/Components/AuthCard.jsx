import { useState } from "react";
import SignInPage from "./SignInForm";

function AuthCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500">
          Sign in to access your SwiftDocs dashboard.
        </p>
      </div>

      {/* Forms */}
      <SignInPage />
    </div>
  );
}

export default AuthCard;
