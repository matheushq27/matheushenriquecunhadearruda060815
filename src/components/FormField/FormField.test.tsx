import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import FormField from './FormField';
import { InputText } from 'primereact/inputtext';

describe('FormField', () => {
  it('Deve renderizar o label com o texto correto e htmlFor', () => {
    render(
      <FormField label="Email" inputId="email1">
        <InputText id="email1" placeholder="Seu endereço de email" />
      </FormField>
    );

    const label = screen.getByText('Email');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'email1');
  });

  it('Deve renderizar o input dentro do componente', () => {
    render(
      <FormField label="Email" inputId="email1">
        <InputText id="email1" placeholder="Seu endereço de email" />
      </FormField>
    );

    const input = screen.getByPlaceholderText('Seu endereço de email');

    expect(input).toBeInTheDocument();
  });

  it('Deve passar classNameContainer corretamente ao container', () => {
    render(
      <FormField
        label="Email"
        inputId="email1"
        classNameContainer="mb-5"
      >
        <InputText id="email1" />
      </FormField>
    );

    const container = screen.getByText('Email').parentElement;

    expect(container).toHaveClass('mb-5');
  });
});
