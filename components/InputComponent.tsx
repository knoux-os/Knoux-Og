import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  name?: string;
  className?: string;
  autoComplete?: string;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}

const InputComponent: React.FC<InputProps> = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  icon,
  name,
  className = '',
  autoComplete,
  onFocus,
  onBlur
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e: React.FocusEvent) => {
    setIsFocused(true);
    if (onFocus) onFocus(e as any);
  };

  const handleBlur = (e: React.FocusEvent) => {
    setIsFocused(false);
    if (onBlur) onBlur(e as any);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      
      <div className="input-wrapper relative">
        {icon && (
          <span className="input-icon absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            {icon}
          </span>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`input-field ${error ? 'input-error' : ''} ${icon ? 'pl-12' : ''} ${type === 'password' ? 'pr-12' : ''}`}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/40 cursor-pointer p-1 flex items-center hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputComponent;