import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionLoading } from './SectionLoading'

vi.mock('primereact/progressspinner', () => ({
  ProgressSpinner: () => (
    <div data-testid="progress-spinner" className="p-progress-spinner">
      <div className="p-progress-spinner-circle"></div>
    </div>
  ),
}))

describe('SectionLoading Component', () => {
  it('Não deve renderizar nada quando loading for false', () => {
    const { container } = render(<SectionLoading loading={false} />)
    
    expect(container.firstChild).toBeNull()
  })

  it('Deve renderizar o ProgressSpinner quando loading for true', () => {
    render(<SectionLoading loading={true} />)
    
    expect(screen.getByTestId('progress-spinner')).toBeInTheDocument()
  })

  it('Deve ter a estrutura CSS correta quando loading for true', () => {
    render(<SectionLoading loading={true} />)
    
    const container = screen.getByTestId('progress-spinner').parentElement
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('justify-center')
    expect(container).toHaveClass('items-center')
    expect(container).toHaveClass('h-96')
  })

  it('Deve renderizar apenas um ProgressSpinner quando loading for true', () => {
    render(<SectionLoading loading={true} />)
    
    const spinners = screen.getAllByTestId('progress-spinner')
    expect(spinners).toHaveLength(1)
  })

  it('Deve alternar entre visível e invisível baseado na prop loading', () => {
    const { rerender } = render(<SectionLoading loading={true} />)
    
    expect(screen.getByTestId('progress-spinner')).toBeInTheDocument()
    
    rerender(<SectionLoading loading={false} />)
    
    expect(screen.queryByTestId('progress-spinner')).not.toBeInTheDocument()
    
    rerender(<SectionLoading loading={true} />)
    
    expect(screen.getByTestId('progress-spinner')).toBeInTheDocument()
  })

  it('Deve renderizar o componente vazio quando loading mudar de true para false', () => {
    const { container, rerender } = render(<SectionLoading loading={true} />)
    
    expect(screen.getByTestId('progress-spinner')).toBeInTheDocument()
    
    rerender(<SectionLoading loading={false} />)
    
    expect(container.firstChild).toBeNull()
  })
})