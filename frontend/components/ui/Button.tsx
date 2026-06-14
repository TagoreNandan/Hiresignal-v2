import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseClasses = 'font-label-md text-label-md px-6 py-2 uppercase tracking-wider transition-colors';
    const variantClasses = {
      primary: 'bg-primary-container text-on-primary-container',
      secondary: 'text-on-surface-variant hover:bg-surface-container-high',
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
