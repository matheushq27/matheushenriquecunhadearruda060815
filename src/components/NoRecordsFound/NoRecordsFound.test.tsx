import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NoRecordsFound from './NoRecordsFound'

describe('NoRecordsFound Component', () => {
    it('Deve renderizar o componente corretamente', () => {
        render(<NoRecordsFound />)
        
        const element = screen.getByText('Nenhum registro encontrado.')
        expect(element).toBeInTheDocument()
    })

    it('Deve ter as classes CSS corretas', () => {
        render(<NoRecordsFound />)
        
        const element = screen.getByText('Nenhum registro encontrado.')
        expect(element).toHaveClass('text-center')
        expect(element).toHaveClass('text-gray-500')
        expect(element).toHaveClass('h-96')
        expect(element).toHaveClass('flex')
        expect(element).toHaveClass('items-center')
        expect(element).toHaveClass('justify-center')
    })

    it('Deve renderizar uma div', () => {
        render(<NoRecordsFound />)
        
        const element = screen.getByText('Nenhum registro encontrado.')
        expect(element.tagName).toBe('DIV')
    })
})