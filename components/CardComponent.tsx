import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    hoverable?: boolean;
    style?: React.CSSProperties;
}

const CardComponent: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = true,
  style = {}
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div 
      className={`card ${hoverable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''} ${className}`}
      onClick={handleClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default CardComponent;