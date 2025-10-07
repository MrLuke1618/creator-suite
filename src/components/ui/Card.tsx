import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;