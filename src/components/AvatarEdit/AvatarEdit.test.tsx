import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AvatarEdit from './AvatarEdit'

const showAlertMock = vi.fn()

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showAlert: showAlertMock,
  }),
}))

vi.mock('primereact/avatar', () => ({
  Avatar: ({ image, icon, size, className, onClick }: any) => (
    <div 
      data-testid="avatar" 
      data-image={image} 
      data-icon={icon} 
      data-size={size} 
      data-classname={className}
      onClick={onClick}
      className="relative"
    >
      {image ? <img src={image} alt="avatar" /> : <i className={icon}></i>}
    </div>
  ),
}))

vi.mock('primereact/button', () => ({
  Button: ({ label, icon, onClick, loading, text, size }: any) => (
    <button 
      onClick={onClick} 
      disabled={loading}
      data-testid="remove-button"
      data-text={text}
      data-size={size}
    >
      {icon && <i className={icon}></i>}
      {label}
    </button>
  ),
}))

describe('AvatarEdit component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    URL.createObjectURL = vi.fn(() => 'mocked-url')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Deve renderizar o avatar com ícone padrão quando não há imagem', () => {
    render(<AvatarEdit />)
    
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('data-icon', 'pi pi-user')
    expect(avatar).not.toHaveAttribute('data-image')
  })

  it('Deve renderizar o avatar com imagem quando currentImageUrl é fornecido', () => {
    const imageUrl = 'https://example.com/image.jpg'
    render(<AvatarEdit currentImageUrl={imageUrl} />)
    
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-image', imageUrl)
  })

  it('Deve chamar showAlert quando clicar com imagem existente', () => {
    const imageUrl = 'https://example.com/image.jpg'
    render(<AvatarEdit currentImageUrl={imageUrl} />)
    
    const avatar = screen.getByTestId('avatar')
    fireEvent.click(avatar)
    
    expect(showAlertMock).toHaveBeenCalledWith('Remova a imagem atual para carregar uma nova.')
  })

  it('Deve abrir o input de arquivo quando clicar sem imagem', () => {
    const onImageUploadMock = vi.fn()
    render(<AvatarEdit onImageUpload={onImageUploadMock} />)
    
    const avatar = screen.getByTestId('avatar')
    fireEvent.click(avatar)
    
    expect(showAlertMock).not.toHaveBeenCalled()
  })

  it('Deve processar arquivo selecionado corretamente', async () => {
    const onImageUploadMock = vi.fn()
    render(<AvatarEdit onImageUpload={onImageUploadMock} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(input!)
    
    await waitFor(() => {
      expect(onImageUploadMock).toHaveBeenCalledWith(file)
      expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    })
  })

  it('Deve remover imagem corretamente', async () => {
    const onImageUploadMock = vi.fn()
    const imageUrl = 'https://example.com/image.jpg'
    
    render(<AvatarEdit currentImageUrl={imageUrl} onImageUpload={onImageUploadMock} />)
    
    const removeButton = screen.getByTestId('remove-button')
    expect(removeButton).toBeInTheDocument()
    
    fireEvent.click(removeButton)
    
    await waitFor(() => {
      expect(onImageUploadMock).toHaveBeenCalledWith(null)
      expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument()
    })
  })

  it('Deve aplicar classes CSS corretas quando há imagem', () => {
    const imageUrl = 'https://example.com/image.jpg'
    render(<AvatarEdit currentImageUrl={imageUrl} />)
    
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-classname', expect.stringContaining('border-gray-300'))
    expect(avatar).not.toHaveAttribute('data-classname', expect.stringContaining('border-dashed'))
  })

  it('Deve aplicar classes CSS corretas quando não há imagem', () => {
    render(<AvatarEdit />)
    
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-classname', expect.stringContaining('border-dashed'))
    expect(avatar).toHaveAttribute('data-classname', expect.stringContaining('hover:border-gray-400'))
  })

  it('Deve aceitar tamanho customizado', () => {
    render(<AvatarEdit size="large" />)
    
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-size', 'large')
  })

  it('Deve mostrar botão de remover apenas quando há imagem', () => {
    const { rerender } = render(<AvatarEdit />)
    
    expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument()
    
    rerender(<AvatarEdit currentImageUrl="test.jpg" />)
    expect(screen.getByTestId('remove-button')).toBeInTheDocument()
  })

  it('Deve atualizar imagem quando currentImageUrl mudar', () => {
    const { rerender } = render(<AvatarEdit currentImageUrl="initial.jpg" />)
    
    let avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-image', 'initial.jpg')
    
    rerender(<AvatarEdit currentImageUrl="updated.jpg" />)
    
    avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-image', 'updated.jpg')
  })
})