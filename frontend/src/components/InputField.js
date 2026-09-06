// frontend/src/components/InputField.js - Secure form input with validation

import React, { useState } from 'react';
import SecurityUtils from '../utils/security';

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  validation,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Sanitize input
    if (type === 'text' || type === 'textarea') {
      inputValue = SecurityUtils.escapeHTML(inputValue);
    }

    onChange(inputValue);

    // Real-time validation if provided
    if (validation) {
      const validationResult = SecurityUtils.validateInput(inputValue, validation, required);
      if (!validationResult.valid) {
        // Show validation error
      }
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        maxLength={type === 'password' ? 128 : 255}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : isFocused
            ? 'border-blue-500 focus:ring-blue-500'
            : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
