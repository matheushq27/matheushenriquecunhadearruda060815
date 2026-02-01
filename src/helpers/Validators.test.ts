import { describe, it, expect, vi } from 'vitest'
import { validateCPF } from './Validators'

vi.mock('./Formatters', () => ({
  keepOnlyNumbers: vi.fn((value) => value.replace(/\D+/g, ''))
}))

vi.mock('cpf-cnpj-validator', () => ({
  cpf: {
    isValid: vi.fn((cpf) => {
      const cleanCPF = cpf.replace(/\D+/g, '')
      return cleanCPF.length === 11 && cleanCPF !== '00000000000'
    })
  }
}))

describe('Validators', () => {
  describe('validateCPF', () => {
    it('Deve retornar true para CPF válido', () => {
      expect(validateCPF('12345678901')).toBe(true)
    })

    it('Deve retornar false para CPF inválido', () => {
      expect(validateCPF('00000000000')).toBe(false)
    })

    it('Deve retornar false para CPF com menos de 11 dígitos', () => {
      expect(validateCPF('1234567890')).toBe(false)
    })

    it('Deve retornar false para CPF com mais de 11 dígitos', () => {
      expect(validateCPF('123456789012')).toBe(false)
    })

    it('Deve retornar false quando CPF for vazio', () => {
      expect(validateCPF('')).toBe(false)
    })

    it('Deve retornar false quando CPF for null', () => {
      expect(validateCPF(null as any)).toBe(false)
    })

    it('Deve retornar false quando CPF for undefined', () => {
      expect(validateCPF(undefined as any)).toBe(false)
    })

    it('Deve aceitar CPF formatado com máscara', () => {
      expect(validateCPF('123.456.789-01')).toBe(true)
    })

    it('Deve aceitar CPF com espaços e caracteres especiais', () => {
      expect(validateCPF(' 123.456.789-01 ')).toBe(true)
    })
  })
})