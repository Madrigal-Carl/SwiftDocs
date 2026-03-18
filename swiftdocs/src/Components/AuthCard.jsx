import { useState } from "react";
import SignInForm from "./SignInForm";

function AuthCard() {
  const [tab, setTab] = useState("signin");

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {tab === "signin" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-sm text-gray-500">
          {tab === "signin"
            ? "Sign in to access your SwiftDocs dashboard."
            : "Join SwiftDocs and start requesting documents instantly."}
        </p>
      </div>

      {/* Forms */}
      {tab === "signin" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}

export default AuthCard;