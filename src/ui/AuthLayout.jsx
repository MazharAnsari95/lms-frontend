import React from "react";
import { Sparkles } from "lucide-react";

const AuthLayout = ({ title, subtitle, children, side }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-black">
      
      <div className="grid w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg bg-white lg:grid-cols-2">
        
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          
          <div className="flex items-center gap-2">
            <Sparkles />
            <span className="font-bold">IMS</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Institute Management, reimagined.
            </h2>
            <p className="text-sm opacity-90">
              Manage students, staff, courses and finances easily.
            </p>
          </div>

          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} IMS
          </p>
        </div>

        {/* Right Panel */}
        <div className="p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            
            <h1 className="text-2xl font-bold mb-2 text-gray-800">
              {title}
            </h1>
            <p className="text-gray-500 mb-6">{subtitle}</p>

            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;