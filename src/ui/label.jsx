import React from "react";

const Label = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block mb-1">
      {children}
    </label>
  );
};

export default Label;