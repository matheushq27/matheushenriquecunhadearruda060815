import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

import { twMerge } from 'tailwind-merge';

interface FormFieldProps {
  label: string;
  inputId: string;
  classNameContainer?: string;
  children: ReactNode;
  errorMessage?: FieldError | undefined;
  required?: boolean;
}

const FormField = ({
  label,
  inputId,
  classNameContainer,
  children,
  errorMessage,
  required = false
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
        className="block text-900 text-base font-medium"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {children}
      {errorMessage && errorMessage.message && (
        <small className="p-error mt-1">{errorMessage.message}</small>
      )}
    </div>
  );
};

export default FormField;
