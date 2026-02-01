import { describe, it, expect } from 'vitest'
import { AppError } from './AppError'

describe('AppError', () => {
  describe('constructor', () => {
    it('Deve criar erro com mensagem padrão quando não for fornecida', () => {
      const error = new AppError()
      expect(error.message).toBe('Erro na requisição')
    })

    it('Deve criar erro com mensagem customizada fornecida', () => {
      const customMessage = 'Erro ao processar dados'
      const error = new AppError(customMessage)
      expect(error.message).toBe(customMessage)
    })

    it('Deve criar erro com mensagem vazia quando string vazia for fornecida', () => {
      const error = new AppError('')
      expect(error.message).toBe('')
    })

    it('Deve usar mensagem padrão quando null for fornecido', () => {
      const error = new AppError(null as any)
      expect(error.message).toBe('Erro na requisição')
    })

    it('Deve usar mensagem padrão quando undefined for fornecido', () => {
      const error = new AppError(undefined as any)
      expect(error.message).toBe('Erro na requisição')
    })

    it('Não deve ser instância de Error (classe customizada)', () => {
      const error = new AppError('Mensagem de erro')
      expect(error).not.toBeInstanceOf(Error)
    })

    it('Deve ser instância de AppError', () => {
      const error = new AppError('Mensagem de erro')
      expect(error).toBeInstanceOf(AppError)
    })

    it('Deve ter nome correto da classe', () => {
      const error = new AppError('Mensagem de erro')
      expect(error.constructor.name).toBe('AppError')
    })

    it('Deve aceitar mensagens com caracteres especiais', () => {
      const specialMessage = 'Erro: @#$%&*()_+-=[]{}|;:,.<>?'
      const error = new AppError(specialMessage)
      expect(error.message).toBe(specialMessage)
    })

    it('Deve aceitar mensagens longas', () => {
      const longMessage = 'Este é um erro muito longo que pode conter muitas informações sobre o que aconteceu durante a execução da aplicação e precisa ser totalmente descrito para o usuário entender o problema'
      const error = new AppError(longMessage)
      expect(error.message).toBe(longMessage)
    })
  })
})