import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, FormControlLabel } from '@mui/material';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps extends Omit<MuiCheckboxProps, 'onChange'> {
  label?: string;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  onChange, 
  className,
  ...props 
}) => {
  const checkbox = (
    <MuiCheckbox
      {...props}
      onChange={(e) => onChange(e.target.checked)}
      className={twMerge('text-blue-600 focus:ring-blue-500', className)}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={checkbox}
        label={label}
        className="text-gray-700"
      />
    );
  }

  return checkbox;
}; 