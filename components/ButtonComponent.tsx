import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const ButtonComponent: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
  fullWidth = false,
  style = {}
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const baseClass = 'btn';
  
  // Mapping provided string variants to classes
  let variantClass = 'btn-primary';
  if (variant === 'secondary') variantClass = 'btn-secondary';
  if (variant === 'outline') variantClass = 'btn-outline'; // Assumes .btn-outline exists or maps to it
  if (variant === 'ghost') variantClass = 'btn-ghost';

  const sizeClass = {
    small: 'text-xs py-1 px-3',
    medium: 'text-sm py-2 px-4',
    large: 'text-base py-3 px-6',
  }[size] || 'text-sm py-2 px-4';
  
  const buttonClasses = `
    ${baseClass}
    ${variantClass}
    ${sizeClass}
    ${loading ? 'btn-loading cursor-wait' : ''}
    ${fullWidth ? 'w-full flex justify-center' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? (
        <span className="spinner w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
      ) : (
        <>
            {icon && <span className="btn-icon mr-2 flex items-center">{icon}</span>}
            {children}
        </>
      )}
    </button>
  );
};

export default ButtonComponent;