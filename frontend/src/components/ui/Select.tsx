import React from 'react';
import { Select as MuiSelect, MenuItem, SelectProps as MuiSelectProps } from '@mui/material';

interface Option {
  value: number;
  label: string;
}

interface SelectProps extends Omit<MuiSelectProps, 'onChange'> {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <MuiSelect
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
}; 