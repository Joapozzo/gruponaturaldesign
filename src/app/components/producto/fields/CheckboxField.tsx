import React from 'react';

interface CheckboxFieldProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
      />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
};

