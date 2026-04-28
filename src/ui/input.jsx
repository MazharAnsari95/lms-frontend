import React from "react";

const Input = ({ type = "text", placeholder, id }) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="border p-2 w-full rounded"
    />
  );
};

export default Input;