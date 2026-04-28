import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";

import "../components/style.css";

import { toast } from "react-toastify";
import { api, getErrorMessage } from "../lib/api";

import AuthLayout from "../ui/AuthLayout";
import Label from "../ui/label";
import Input from "../ui/input";
import Button from "../ui/button";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Submit
  const submitHandler = (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error("Please upload logo");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("image", image);

    api
      .post("/user/signup", formData)
      .then(() => {
        setLoading(false);
        toast.success("Signup Successful ✅");
        navigate("/login");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(getErrorMessage(err));
      });
  };

  // ✅ File Handler (with validation)
  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Type check
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files allowed");
    }

    // Size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Max size 2MB");
    }

    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  // ✅ Clear Image
  const clearImage = () => {
    setImage(null);
    setImageUrl("");
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your institute in less than a minute"
    >
      <form onSubmit={submitHandler} className="space-y-5">
        
        {/* Image Upload */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="preview"
                  className="h-16 w-16 rounded-xl border object-cover"
                />

                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="h-16 w-16 flex items-center justify-center border rounded-xl bg-gray-100">
                <ImagePlus />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="image">Upload logo</Label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={fileHandler}
              className="block text-sm mt-1"
            />
            <p className="text-xs text-gray-500">PNG/JPG max 2MB</p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">Institute Name</Label>
          <div className="relative">
       
            <Input
              id="fullName"
              placeholder="Institute name"
              className="pl-9"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
           
            <Input
              type="email"
              placeholder="Email"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
          
            <Input
              type="tel"
              placeholder="Phone"
              className="pl-9"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="relative">
         
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="pl-9 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Creating...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Login */}
        <p className="text-center text-sm">
          Already have account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;