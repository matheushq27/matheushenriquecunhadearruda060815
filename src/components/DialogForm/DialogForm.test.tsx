import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DialogForm from './DialogForm'

vi.mock('primereact/dialog', () => ({
  Dialog: ({ header, visible, onHide, draggable, className, children }: any) => (
    visible ? (
      <div 
        data-testid="dialog" 
        data-header={header} 
        data-visible={visible} 
        data-draggable={draggable}
        className={className}
      >
        <button onClick={onHide} data-testid="close-button">Close</button>
        {children}
      </div>
    ) : null
  ),
}))

vi.mock('primereact/button', () => ({
  Button: ({ label, onClick, className, severity }: any) => (
    <button 
      data-testid={`button-${label?.toLowerCase() || 'custom'}`}
      onClick={onClick}
      className={className}
      data-severity={severity}
    >
      {label}
    </button>
  ),
}))

describe('DialogForm', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Dialog',
    children: <div>Test Content</div>,
  }

  it('Deve renderizar o dialog quando isOpen for true', () => {
    render(<DialogForm {...defaultProps} />)
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-header', 'Test Dialog')
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-visible', 'true')
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-draggable', 'false')
  })

  it('Não deve renderizar o dialog quando isOpen for false', () => {
    render(<DialogForm {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('Deve renderizar o título correto', () => {
    render(<DialogForm {...defaultProps} title="Custom Title" />)
    
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-header', 'Custom Title')
  })

  it('Deve renderizar o conteúdo filho', () => {
    const customContent = <div data-testid="custom-content">Custom Content</div>
    render(<DialogForm {...defaultProps}>{customContent}</DialogForm>)
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText('Custom Content')).toBeInTheDocument()
  })

  it('Deve renderizar o botão Cancelar', () => {
    render(<DialogForm {...defaultProps} />)
    
    const cancelButton = screen.getByTestId('button-cancelar')
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton).toHaveTextContent('Cancelar')
    expect(cancelButton).toHaveAttribute('data-severity', 'danger')
    expect(cancelButton).toHaveClass('w-full')
  })

  it('Deve chamar onClose quando o botão Cancelar for clicado', () => {
    const onCloseMock = vi.fn()
    render(<DialogForm {...defaultProps} onClose={onCloseMock} />)
    
    const cancelButton = screen.getByTestId('button-cancelar')
    fireEvent.click(cancelButton)
    
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('Deve chamar onClose quando o botão de fechar do dialog for clicado', () => {
    const onCloseMock = vi.fn()
    render(<DialogForm {...defaultProps} onClose={onCloseMock} />)
    
    const closeButton = screen.getByTestId('close-button')
    fireEvent.click(closeButton)
    
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('Deve aplicar as classes CSS corretas', () => {
    render(<DialogForm {...defaultProps} />)
    
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveClass('w-[90%]', 'md:w-[50vw]', 'lg:w-[30vw]', 'xl:w-[20vw]')
  })

  it('Deve renderizar o container do botão com margem superior', () => {
    const { container } = render(<DialogForm {...defaultProps} />)
    
    const buttonContainer = container.querySelector('.mt-2')
    expect(buttonContainer).toBeInTheDocument()
  })

  it('Deve renderizar múltiplos filhos corretamente', () => {
    const children = (
      <>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </>
    )
    render(<DialogForm {...defaultProps}>{children}</DialogForm>)
    
    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
  })

  it('Deve passar todas as props corretamente para o Dialog', () => {
    render(<DialogForm {...defaultProps} />)
    
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-header', 'Test Dialog')
    expect(dialog).toHaveAttribute('data-visible', 'true')
    expect(dialog).toHaveAttribute('data-draggable', 'false')
  })

  it('Deve renderizar com diferentes títulos', () => {
    const titles = ['Dialog 1', 'Dialog 2', 'Dialog 3']
    
    titles.forEach(title => {
      const { unmount } = render(<DialogForm {...defaultProps} title={title} />)
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-header', title)
      unmount()
    })
  })
})