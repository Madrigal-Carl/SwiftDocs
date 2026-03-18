import { useState } from "react";
import Input from "./Input";
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import { login } from "../services/auth_service";
import { useAuth } from "../stores/auth_store";

function SignInForm() {
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...form, remember_me: remember };
      const res = await login(payload);

      // store token
      if (res.token) localStorage.setItem("token", res.token);

      // ✅ add initials before updating auth context
      const getInitials = (fullname) => {
        if (!fullname) return "U";
        return fullname
          .replace(",", " ")
          .split(" ")
          .filter(Boolean)
          .map((word) => word[0].toUpperCase())
          .join("")
          .slice(0, 3);
      };

      setUser({
        ...res.account,
        initials: getInitials(res.account.fullname),
      });

      // RoleRouter will automatically handle redirect
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Email Address
        </label>
        <Input
          icon={<Mail />}
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
          icon={<Lock />}
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
              {showPassword ? <EyeClosed /> : <Eye />}
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
