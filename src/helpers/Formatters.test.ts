import { describe, it, expect } from 'vitest'
import { keepOnlyNumbers } from './Formatters'

describe('Formatters', () => {
  describe('keepOnlyNumbers', () => {
    it('Deve remover todos os caracteres não numéricos', () => {
      expect(keepOnlyNumbers('abc123def456')).toBe('123456')
    })

    it('Deve remover espaços, pontos, traços e parênteses', () => {
      expect(keepOnlyNumbers('(11) 98765-4321')).toBe('11987654321')
    })

    it('Deve remover letras especiais e acentuações', () => {
      expect(keepOnlyNumbers('áéíóú123âêîôû')).toBe('123')
    })

    it('Deve retornar string vazia quando valor for vazio', () => {
      expect(keepOnlyNumbers('')).toBe('')
    })

    it('Deve retornar string vazia quando valor for null', () => {
      expect(keepOnlyNumbers(null as any)).toBe('')
    })

    it('Deve retornar string vazia quando valor for undefined', () => {
      expect(keepOnlyNumbers(undefined as any)).toBe('')
    })

    it('Deve manter números decimais', () => {
      expect(keepOnlyNumbers('123.45')).toBe('12345')
    })

    it('Deve remover todos os símbolos especiais', () => {
      expect(keepOnlyNumbers('!@#$%¨&*()_+-=[]{}|;:,.<>?')).toBe('')
    })

    it('Deve manter apenas números de 0 a 9', () => {
      expect(keepOnlyNumbers('0123456789')).toBe('0123456789')
    })

    it('Deve funcionar com strings grandes', () => {
      const input = 'Telefone: (11) 98765-4321, CPF: 123.456.789-01'
      expect(keepOnlyNumbers(input)).toBe('1198765432112345678901')
    })
  })
})