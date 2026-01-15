import type { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

interface FormFieldProps {
  label: string;
  inputId: string;
  classNameContainer?: string;
  children: ReactNode;
}

const FormField = ({
  label,
  inputId,
  classNameContainer,
  children,
}: FormFieldProps) => {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-2',
        classNameContainer
      )}
    >
      <label
        htmlFor={inputId}
        className="block text-900 text-xl font-medium"
      >
        {label}
      </label>

      {children}
    </div>
  );
};

export default FormField;
