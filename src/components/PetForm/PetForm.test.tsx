import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PetForm from './PetForm'

const mockControl = {}
const mockHandleSubmit = vi.fn((callback) => (data: any) => callback(data))
const mockReset = vi.fn()
const mockFormState = { errors: {} }

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    control: mockControl,
    handleSubmit: mockHandleSubmit,
    formState: mockFormState,
    reset: mockReset,
  })),
  Controller: ({ name, render }: any) => (
    <div data-testid={`controller-${name}`}>
      {render({ field: { name, value: '', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() } })}
    </div>
  ),
}))

vi.mock('primereact/button', () => ({
  Button: ({ label, icon, onClick, className, loading, type }: any) => (
    <button 
      data-testid={`button-${label?.toLowerCase().replace(/\s+/g, '-') || 'button'}`}
      onClick={onClick} 
      className={className}
      type={type}
      disabled={loading}
    >
      {icon && <i className={icon}></i>}
      {label}
    </button>
  ),
}))

vi.mock('primereact/inputtext', () => ({
  InputText: ({ id, placeholder, invalid, ...props }: any) => (
    <input 
      data-testid={id || 'inputtext'}
      placeholder={placeholder}
      className={invalid ? 'p-invalid' : ''}
      {...props}
    />
  ),
}))

vi.mock('primereact/inputnumber', () => ({
  InputNumber: ({ id, placeholder, invalid, onValueChange, value }: any) => (
    <input 
      data-testid={id || 'inputnumber'}
      placeholder={placeholder}
      className={invalid ? 'p-invalid' : ''}
      value={value}
      onChange={(e) => onValueChange && onValueChange({ value: e.target.value })}
      type="number"
    />
  ),
}))

vi.mock('@/components/DialogForm', () => ({
  DialogForm: ({ title, isOpen, onClose, children }: any) => (
    isOpen ? (
      <div data-testid="dialogform" data-title={title}>
        <button data-testid="close-dialog" onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null
  ),
}))

vi.mock('../FormField', () => ({
  FormField: ({ label, inputId, errorMessage, children }: any) => (
    <div data-testid={`formfield-${inputId}`}>
      <label htmlFor={inputId}>{label}</label>
      {errorMessage && <span className="error">{errorMessage}</span>}
      {children}
    </div>
  ),
}))

vi.mock('../AvatarEdit', () => ({
  AvatarEdit: ({ currentImageUrl, onImageUpload, loading }: any) => (
    <div data-testid="avatar-edit" data-imageurl={currentImageUrl} data-loading={loading}>
      <button data-testid="upload-button" onClick={() => onImageUpload(new File([], 'test.jpg'))}>
        Upload
      </button>
    </div>
  ),
}))

const showSuccessMock = vi.fn()
vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showSuccess: showSuccessMock }),
}))

const handleErrorMock = vi.fn()
vi.mock('@/hooks/useHandleError', () => ({
  useErrorHandler: () => ({ handleError: handleErrorMock }),
}))

const createPetMock = vi.fn()
const updatePetMock = vi.fn()
const getPetMock = vi.fn()
const updatePetPhotoMock = vi.fn()
const removePetPhotoMock = vi.fn()

vi.mock('@/services/pets/pets.service', () => ({
  createPet: (data: any) => createPetMock(data),
  updatePet: (id: number, data: any) => updatePetMock(id, data),
  getPet: (id: number) => getPetMock(id),
  updatePetPhoto: (id: number, photo: File) => updatePetPhotoMock(id, photo),
  removePetPhoto: (data: any) => removePetPhotoMock(data),
}))

const setCurrentPetMock = vi.fn()
const updatePetPhotoStoreMock = vi.fn()
let currentPetMock: any = null

vi.mock('@/stores/pets.store', () => ({
  usePetsStore: (selector: any) => selector({
    currentPet: currentPetMock,
    setCurrentPet: setCurrentPetMock,
    updatePetPhoto: updatePetPhotoStoreMock,
  }),
}))

describe('PetForm Component', () => {
  const defaultProps = {
    afterCreating: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    currentPetMock = null
    mockFormState.errors = {}
  })

  it('Deve renderizar o botão de adicionar corretamente', () => {
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveTextContent('Adicionar')
  })

  it('Deve abrir o dialog quando o botão de adicionar for clicado', () => {
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    expect(screen.getByTestId('dialogform')).toBeInTheDocument()
    expect(screen.getByTestId('dialogform')).toHaveAttribute('data-title', 'Criar Pet')
  })

  it('Deve renderizar o formulário quando o dialog estiver aberto', () => {
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    expect(screen.getByTestId('formfield-nome')).toBeInTheDocument()
    expect(screen.getByTestId('formfield-breed')).toBeInTheDocument()
    expect(screen.getByTestId('formfield-age')).toBeInTheDocument()
    expect(screen.getByTestId('button-salvar-pet')).toBeInTheDocument()
  })

  it('Deve renderizar modo de edição quando currentPet estiver definido', () => {
    currentPetMock = { id: 1, nome: 'Rex', raca: 'Golden', idade: 3, foto: { url: 'test.jpg', id: 1 } }
    
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    waitFor(() => {
      expect(screen.getByTestId('dialogform')).toHaveAttribute('data-title', 'Editar Pet')
      expect(screen.getByTestId('avatar-edit')).toBeInTheDocument()
      expect(screen.getByTestId('button-atualizar-pet')).toBeInTheDocument()
    })
  })

  it('Deve chamar createPet ao submeter o formulário no modo criação', async () => {
    createPetMock.mockResolvedValueOnce({})
    
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    const submitButton = screen.getByTestId('button-salvar-pet')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(createPetMock).toHaveBeenCalled()
      expect(showSuccessMock).toHaveBeenCalledWith('Pet criado com sucesso!')
      expect(defaultProps.afterCreating).toHaveBeenCalled()
    })
  })

  it('Deve chamar updatePet ao submeter o formulário no modo edição', async () => {
    currentPetMock = { id: 1, nome: 'Rex', raca: 'Golden', idade: 3 }
    updatePetMock.mockResolvedValueOnce({})
    
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    const submitButton = await screen.findByTestId('button-atualizar-pet')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(updatePetMock).toHaveBeenCalledWith(1, expect.any(Object))
      expect(showSuccessMock).toHaveBeenCalledWith('Pet atualizado com sucesso!')
    })
  })

  it('Deve fechar o dialog ao clicar no botão de fechar', () => {
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    const closeButton = screen.getByTestId('close-dialog')
    fireEvent.click(closeButton)
    
    expect(screen.queryByTestId('dialogform')).not.toBeInTheDocument()
  })

  it('Deve resetar o formulário ao fechar o dialog', () => {
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    const closeButton = screen.getByTestId('close-dialog')
    fireEvent.click(closeButton)
    
    expect(mockReset).toHaveBeenCalledWith({
      name: '',
      breed: '',
      age: 0,
    })
    expect(setCurrentPetMock).toHaveBeenCalledWith(null)
  })

  it('Deve lidar com erros ao criar pet', async () => {
    const error = new Error('Erro ao criar pet')
    createPetMock.mockRejectedValueOnce(error)
    
    render(<PetForm {...defaultProps} />)
    
    const addButton = screen.getByTestId('button-adicionar')
    fireEvent.click(addButton)
    
    const submitButton = screen.getByTestId('button-salvar-pet')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(handleErrorMock).toHaveBeenCalledWith(error, 'Erro ao salvar pet')
    })
  })
})