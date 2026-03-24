import { useState } from "react";
import Input from "./Input";
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import { login } from "../services/auth_service";
import { useAuth } from "../stores/auth_store";
import { showToast } from "../utils/swal";

function SignInForm() {
  const { setUser, reloadUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!form.email.trim() || !form.password.trim()) {
      showToast("error", "Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...form, remember_me: remember };
      const res = await login(payload); // call auth_service login

      // Optional: store token if your service returns one (some setups use cookies)
      if (res.token) localStorage.setItem("token", res.token);

      // Reload user info from backend
      await reloadUser();

      // Add initials
      setUser((prev) => ({
        ...prev,
        initials: prev?.fullname
          ?.split(" ")
          .filter(Boolean)
          .map((w) => w[0].toUpperCase())
          .join("")
          .slice(0, 3),
      }));

      // Show success toast
      showToast("success", res.message || "Login successful");

      // RoleRouter or other redirects will handle navigation
    } catch (err) {
      console.error("Login error:", err.response?.data);

      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";

      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Email Address
        </label>
        <Input
          icon={<Mail className="w-4 h-4" />}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Password
        </label>
        <Input
          icon={<Lock className="w-4 h-4" />}
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          right={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeClosed className="text-gray-400 w-5 h-5 mt-2" />
              ) : (
                <Eye className="text-gray-400 w-5 h-5 mt-2" />
              )}
            </button>
          }
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-blue-600"
          />
          Remember me
        </label>
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default SignInForm;
