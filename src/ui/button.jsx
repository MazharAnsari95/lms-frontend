import React from "react";

const Button = ({ children, type = "button" }) => {
  return (
    <button
      type={type}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {children}
    </button>
  );
};

export default Button;