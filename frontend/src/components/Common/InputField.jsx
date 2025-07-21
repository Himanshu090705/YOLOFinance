import React from 'react';

const InputField = ({ type="text", placeholder, value, onChange, name }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    name={name}
    onChange={onChange}
    required
    style={{
      margin: "8px 0",
      padding: "10px",
      fontSize: "16px",
      width: "100%",
      borderRadius: "4px",
      border: "1px solid #ddd",
    }}
  />
);

export default InputField;
