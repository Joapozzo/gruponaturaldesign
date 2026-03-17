import React from 'react';

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  step?: string;
  autoComplete?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  type = 'text',
  disabled = false,
  readOnly = false,
  step,
  autoComplete,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        step={step}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled || readOnly ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

