"use client";

import { useAppDispatch } from "@/lib/hooks";
import { login } from "@/lib/reducer/authSlice";
import { Mail, EyeOff, Eye, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";

const FormLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoggingIn(true);
    const success = validateForm();

    if (success === true) {
      try {
        await dispatch(login(formData)).unwrap();
        console.log("These is called", router);
        router.push("/");
        console.log("router.push called");
      } catch (error) {
        console.log(error);
      } finally {
        setFormData({
          email: "",
          password: "",
        });
        setIsLoggingIn(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control space-y-1">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="size-5 text-base-content/40 z-10" />
          </div>
          <input
            type="email"
            className={`input input-bordered w-full pl-10`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="form-control space-y-1">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="size-5 text-base-content/40 z-10" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            className={`input input-bordered w-full pl-10`}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-5 text-base-content/40" />
            ) : (
              <Eye className="size-5 text-base-content/40" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Loading...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};
export default FormLogin;
