import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PetFilters from './PetFilters'

vi.mock('primereact/inputtext', () => ({
  InputText: ({ id, placeholder, value, onChange, disabled }: any) => (
    <input 
      data-testid={id} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      disabled={disabled}
    />
  ),
}))

vi.mock('primereact/button', () => ({
  Button: ({ label, onClick, className, disabled }: any) => (
    <button 
      data-testid={`button-${label.toLowerCase()}`}
      onClick={onClick} 
      className={className}
      disabled={disabled}
    >
      {label}
    </button>
  ),
}))

vi.mock('../FormField', () => ({
  FormField: ({ label, inputId, children }: any) => (
    <div data-testid={`formfield-${inputId}`}>
      <label htmlFor={inputId}>{label}</label>
      {children}
    </div>
  ),
}))

describe('PetFilters Component', () => {
  const defaultProps = {
    name: '',
    breed: '',
    loadingPets: false,
    handleFilter: vi.fn(),
    setName: vi.fn(),
    setBreed: vi.fn(),
  }

  it('Deve renderizar o componente corretamente', () => {
    render(<PetFilters {...defaultProps} />)
    
    expect(screen.getByTestId('formfield-name')).toBeInTheDocument()
    expect(screen.getByTestId('formfield-breed')).toBeInTheDocument()
    expect(screen.getByTestId('button-filtrar')).toBeInTheDocument()
  })

  it('Deve renderizar os campos de input com placeholders corretos', () => {
    render(<PetFilters {...defaultProps} />)
    
    const nameInput = screen.getByTestId('name')
    const breedInput = screen.getByTestId('breed')
    
    expect(nameInput).toHaveAttribute('placeholder', 'Ex: Rex')
    expect(breedInput).toHaveAttribute('placeholder', 'Ex: Golden Retriever')
  })

  it('Deve chamar setName quando o input de nome for alterado', () => {
    render(<PetFilters {...defaultProps} />)
    
    const nameInput = screen.getByTestId('name')
    fireEvent.change(nameInput, { target: { value: 'Rex' } })
    
    expect(defaultProps.setName).toHaveBeenCalledWith('Rex')
  })

  it('Deve chamar setBreed quando o input de raça for alterado', () => {
    render(<PetFilters {...defaultProps} />)
    
    const breedInput = screen.getByTestId('breed')
    fireEvent.change(breedInput, { target: { value: 'Golden Retriever' } })
    
    expect(defaultProps.setBreed).toHaveBeenCalledWith('Golden Retriever')
  })

  it('Deve chamar handleFilter quando o botão de filtrar for clicado', () => {
    render(<PetFilters {...defaultProps} />)
    
    const filterButton = screen.getByTestId('button-filtrar')
    fireEvent.click(filterButton)
    
    expect(defaultProps.handleFilter).toHaveBeenCalledTimes(1)
  })

  it('Deve desabilitar os inputs e botão quando loadingPets for true', () => {
    render(<PetFilters {...defaultProps} loadingPets={true} />)
    
    const nameInput = screen.getByTestId('name')
    const breedInput = screen.getByTestId('breed')
    const filterButton = screen.getByTestId('button-filtrar')
    
    expect(nameInput).toBeDisabled()
    expect(breedInput).toBeDisabled()
    expect(filterButton).toBeDisabled()
  })

  it('Deve renderizar o botão adicional quando afterFilterButton for fornecido', () => {
    const afterFilterButton = <button data-testid="extra-button">Extra</button>
    render(<PetFilters {...defaultProps} afterFilterButton={afterFilterButton} />)
    
    expect(screen.getByTestId('extra-button')).toBeInTheDocument()
  })

  it('Deve exibir os valores corretos nos inputs', () => {
    render(<PetFilters {...defaultProps} name="Rex" breed="Golden Retriever" />)
    
    const nameInput = screen.getByTestId('name') as HTMLInputElement
    const breedInput = screen.getByTestId('breed') as HTMLInputElement
    
    expect(nameInput.value).toBe('Rex')
    expect(breedInput.value).toBe('Golden Retriever')
  })

  it('Deve ter a estrutura CSS correta', () => {
    render(<PetFilters {...defaultProps} />)
    
    const container = screen.getByTestId('formfield-name').parentElement
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('flex-col')
    expect(container).toHaveClass('sm:flex-row')
    expect(container).toHaveClass('gap-2')
    expect(container).toHaveClass('sm:items-end')
    expect(container).toHaveClass('mb-10')
  })
})