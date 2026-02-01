import { describe, it, expect } from 'vitest'
import { maskPhone, maskCPF } from './Masks'

describe('Masks', () => {
  describe('maskPhone', () => {
    it('Deve mascarar telefone celular com 11 dígitos', () => {
      expect(maskPhone('11987654321')).toBe('(11) 98765-4321')
    })

    it('Deve mascarar telefone fixo com 10 dígitos', () => {
      expect(maskPhone('1133334444')).toBe('(11) 3333-4444')
    })

    it('Deve retornar string vazia quando valor for vazio', () => {
      expect(maskPhone('')).toBe('')
    })

    it('Deve retornar string vazia quando valor for null', () => {
      expect(maskPhone(null as any)).toBe('')
    })

    it('Deve retornar string vazia quando valor for undefined', () => {
      expect(maskPhone(undefined as any)).toBe('')
    })

    it('Deve remover caracteres não numéricos antes de mascarar', () => {
      expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321')
    })

    it('Deve retornar apenas números quando quantidade for diferente de 10 ou 11', () => {
      expect(maskPhone('123')).toBe('123')
      expect(maskPhone('123456789')).toBe('123456789')
      expect(maskPhone('123456789012')).toBe('123456789012')
    })
  })

  describe('maskCPF', () => {
    it('Deve mascarar CPF completo com 11 dígitos', () => {
      expect(maskCPF('12345678901')).toBe('123.456.789-01')
    })

    it('Deve mascarar CPF parcial com 3 dígitos', () => {
      expect(maskCPF('123')).toBe('123')
    })

    it('Deve mascarar CPF parcial com 6 dígitos', () => {
      expect(maskCPF('123456')).toBe('123.456')
    })

    it('Deve mascarar CPF parcial com 9 dígitos', () => {
      expect(maskCPF('123456789')).toBe('123.456.789')
    })

    it('Deve limitar CPF com mais de 11 dígitos', () => {
      expect(maskCPF('123456789012345')).toBe('123.456.789-01')
    })

    it('Deve retornar string vazia quando valor for vazio', () => {
      expect(maskCPF('')).toBe('')
    })

    it('Deve retornar string vazia quando valor for null', () => {
      expect(maskCPF(null as any)).toBe('')
    })

    it('Deve retornar string vazia quando valor for undefined', () => {
      expect(maskCPF(undefined as any)).toBe('')
    })

    it('Deve remover caracteres não numéricos antes de mascarar', () => {
      expect(maskCPF('123.456.789-01')).toBe('123.456.789-01')
    })

    it('Deve aceitar número como entrada', () => {
      expect(maskCPF(12345678901)).toBe('123.456.789-01')
    })
  })
})