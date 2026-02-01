import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CardView } from './CardView'

vi.mock('primereact/avatar', () => ({
  Avatar: ({ image, icon, size, shape }: any) => (
    <div 
      data-testid="avatar" 
      data-image={image} 
      data-icon={icon} 
      data-size={size} 
      data-shape={shape}
    >
      {image ? <img src={image} alt="avatar" /> : <i className={icon}></i>}
    </div>
  ),
}))

vi.mock('primereact/button', () => ({
  Button: ({ children, onClick, icon, tooltip, severity, size, text, disabled, loading }: any) => (
    <button
      data-testid={`button-${icon || 'custom'}`}
      onClick={onClick}
      title={tooltip}
      data-severity={severity}
      data-size={size}
      data-text={text}
      disabled={disabled || loading}
      className={loading ? 'loading' : ''}
    >
      {icon && <i className={icon}></i>}
      {children}
    </button>
  ),
}))

vi.mock('lucide-react', () => ({
  PawPrint: ({ size }: any) => <svg data-testid="pawprint" data-size={size}></svg>,
}))

describe('CardView', () => {
  const defaultProps = {
    avatar: 'https://example.com/avatar.jpg',
    title: 'John Doe',
    subtitle: 'Software Engineer',
  }

  it('Deve renderizar o componente com props obrigatórias', () => {
    render(<CardView {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })

  it('Deve renderizar o avatar com a imagem fornecida', () => {
    render(<CardView {...defaultProps} />)
    
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-image', 'https://example.com/avatar.jpg')
    expect(avatar).toHaveAttribute('data-size', 'large')
    expect(avatar).toHaveAttribute('data-shape', 'circle')
  })

  it('Deve renderizar o conteúdo quando fornecido', () => {
    const content = <div data-testid="custom-content">Custom Content</div>
    render(<CardView {...defaultProps} content={content} />)
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('Deve chamar onEdit quando o botão editar for clicado', () => {
    const onEditMock = vi.fn()
    render(<CardView {...defaultProps} onEdit={onEditMock} />)
    
    const editButton = screen.getByTestId('button-pi pi-pencil')
    fireEvent.click(editButton)
    
    expect(onEditMock).toHaveBeenCalledTimes(1)
  })

  it('Deve chamar onDelete quando o botão excluir for clicado', () => {
    const onDeleteMock = vi.fn()
    render(<CardView {...defaultProps} onDelete={onDeleteMock} />)
    
    const deleteButton = screen.getByTestId('button-pi pi-trash')
    fireEvent.click(deleteButton)
    
    expect(onDeleteMock).toHaveBeenCalledTimes(1)
  })

  it('Deve renderizar o botão de vincular pet quando showPetLinkButton for true', () => {
    render(<CardView {...defaultProps} showPetLinkButton={true} />)
    
    expect(screen.getByTestId('pawprint')).toBeInTheDocument()
  })

  it('Deve chamar onPetLink quando o botão de vincular pet for clicado', () => {
    const onPetLinkMock = vi.fn()
    render(<CardView {...defaultProps} showPetLinkButton={true} onPetLink={onPetLinkMock} />)
    
    const petLinkButton = screen.getByTestId('button-custom')
    fireEvent.click(petLinkButton)
    
    expect(onPetLinkMock).toHaveBeenCalledTimes(1)
  })

  it('Deve desabilitar os botões quando loadingDelete for true', () => {
    render(<CardView {...defaultProps} loadingDelete={true} showPetLinkButton={true} />)
    
    const editButton = screen.getByTestId('button-pi pi-pencil')
    const deleteButton = screen.getByTestId('button-pi pi-trash')
    const petLinkButton = screen.getByTestId('button-custom')
    
    expect(editButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
    expect(petLinkButton).toBeDisabled()
  })

  it('Deve aplicar a classe loading no botão de excluir quando loadingDelete for true', () => {
    render(<CardView {...defaultProps} loadingDelete={true} />)
    
    const deleteButton = screen.getByTestId('button-pi pi-trash')
    expect(deleteButton).toHaveClass('loading')
  })

  it('Deve renderizar corretamente quando showPetLinkButton for false (padrão)', () => {
    render(<CardView {...defaultProps} />)
    
    expect(screen.queryByTestId('pawprint')).not.toBeInTheDocument()
  })

  it('Deve renderizar com as classes CSS corretas', () => {
    const { container } = render(<CardView {...defaultProps} />)
    
    const cardElement = container.firstChild
    expect(cardElement).toHaveClass('bg-white', 'shadow-sm', 'rounded-md', 'flex', 'flex-col', 'justify-between')
  })

  it('Deve renderizar o layout interno corretamente', () => {
    const content = <div>Additional Content</div>
    render(<CardView {...defaultProps} content={content} />)
    
    const contentDiv = screen.getByText('Additional Content').parentElement
    expect(contentDiv).toHaveClass('mt-4')
  })

  it('Deve aplicar as propriedades corretas nos botões', () => {
    const mockEdit = vi.fn()
    const mockDelete = vi.fn()
    const mockPetLink = vi.fn()
    
    const { container } = render(<CardView {...defaultProps} onEdit={mockEdit} onDelete={mockDelete} onPetLink={mockPetLink} showPetLinkButton={true} />)
    
    console.log('HTML renderizado:', container.innerHTML)
    
    const editButton = screen.getByTestId('button-pi pi-pencil')
    const deleteButton = screen.getByTestId('button-pi pi-trash')
    const petLinkButton = screen.getByTestId('button-custom')
    
    expect(editButton).toHaveAttribute('data-severity', 'info')
    expect(editButton).toHaveAttribute('data-size', 'small')
    expect(editButton).toHaveAttribute('data-text', 'true')
    
    expect(deleteButton).toHaveAttribute('data-severity', 'danger')
    expect(deleteButton).toHaveAttribute('data-size', 'small')
    expect(deleteButton).toHaveAttribute('data-text', 'true')
    
    expect(petLinkButton).toHaveAttribute('data-severity', 'info')
    expect(petLinkButton).toHaveAttribute('data-size', 'small')
    expect(petLinkButton).toHaveAttribute('data-text', 'true')
  })
})