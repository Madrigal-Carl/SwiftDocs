import { useState } from "react";
import Input from "./Input";
import { IconMail, IconLock, IconEye, IconEyeOff } from "./icons";

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Email Address
        </label>
        <Input icon={<IconMail />} type="email" placeholder="you@example.com" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Password
        </label>
        <Input
          icon={<IconLock />}
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          right={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IconEyeOff /> : <IconEye />}
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

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
        Sign In
      </button>

    </div>
  );
}

export default SignInForm;