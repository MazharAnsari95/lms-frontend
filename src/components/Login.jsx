import React, { useState } from "react";
import "../components/style.css";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { api, getErrorMessage } from "../lib/api";
import AuthLayout from "../ui/AuthLayout";

import Checkbox from "../ui/checkbox";
import Label from "../ui/label";
import Input from "../ui/input";
import Button from "../ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // ✅ added
  const [remember, setRemember] = useState(false); // ✅ added

  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    api
      .post("/user/login", {
        email,
        password,
      })
      .then((res) => {
        setLoading(false);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("fullName", res.data.fullName);
        localStorage.setItem("imageUrl", res.data.imageUrl);
        localStorage.setItem("imageId", res.data.imageId);
        localStorage.setItem("email", res.data.email);

        toast.success("Login successful ✅");
        navigate("/dashboard/home");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(getErrorMessage(err));
        console.log(err);
      });
  };

  return (
    <AuthLayout
      title="Login to your account"
      subtitle="Enter your credentials"
    >
      <form onSubmit={submitHandler} className="space-y-4">

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full p-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "Sign In"
          )}
        </button>

        {/* Link */}
        <p className="text-sm text-center">
          Don’t have account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;