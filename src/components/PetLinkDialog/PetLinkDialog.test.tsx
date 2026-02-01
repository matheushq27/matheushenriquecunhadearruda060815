import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PetLinkDialog from './PetLinkDialog'
import * as tutorsService from '@/services/tutors/tutors.service'
import { usePets } from '@/hooks/usePets'

vi.mock('primereact/dialog', () => ({
  Dialog: ({ header, visible, onHide, draggable, className, children }: any) => (
    visible ? (
      <div data-testid="dialog" data-header={header} data-draggable={draggable} className={className}>
        <button data-testid="close-button" onClick={onHide}>Close</button>
        {children}
      </div>
    ) : null
  ),
}))

vi.mock('primereact/datatable', () => ({
  DataTable: ({ value, selection, onSelectionChange, onRowSelect, onRowUnselect, loading, className, children }: any) => {
    const renderColumn = (child: any, item: any) => {
      if (child?.type?.name === 'Column' || child?.props?.field) {
        const { field, header, body, bodyStyle, selectionMode, headerStyle } = child.props;
        return (
          <div key={field || header} data-testid={`column-${field || header?.toLowerCase()}`} data-header={header} data-selection-mode={selectionMode} style={headerStyle}>
            {field && <span data-field={field} style={bodyStyle}></span>}
            {body && <div data-body={true}>{typeof body === 'function' ? body(item) : body}</div>}
          </div>
        );
      }
      return child;
    };
    
    return (
      <div data-testid="datatable" data-loading={loading} className={className}>
        <div data-testid="selection-count">{selection?.length || 0} selecionados</div>
        {value?.map((item: any) => (
          <div key={item.id} data-testid={`row-${item.id}`}>
            <input 
              type="checkbox" 
              data-testid={`checkbox-${item.id}`}
              checked={selection?.some((s: any) => s.id === item.id)}
              onChange={(e) => {
                const newSelection = e.target.checked 
                  ? [...(selection || []), item]
                  : (selection || []).filter((s: any) => s.id !== item.id)
                
                onSelectionChange?.({ value: newSelection })
                
                if (e.target.checked) {
                  onRowSelect?.({ data: item, originalEvent: { checked: true } })
                } else {
                  onRowUnselect?.({ data: item, originalEvent: { checked: false } })
                }
              }}
            />
            {Array.isArray(children) ? children.map((child: any) => renderColumn(child, item)) : children}
          </div>
        ))}
      </div>
    );
  },
}))

vi.mock('primereact/avatar', () => ({
  Avatar: ({ image, size, shape }: any) => (
    <div data-testid="avatar" data-image={image} data-size={size} data-shape={shape}>
      {image ? <img src={image} alt="avatar" /> : <i className="pi pi-user"></i>}
    </div>
  ),
}))

vi.mock('../PetFilters', () => ({
  PetFilters: ({ name, breed, loadingPets, handleFilter, setName, setBreed }: any) => (
    <div data-testid="pet-filters">
      <input 
        data-testid="filter-name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Filtrar por nome"
        disabled={loadingPets}
      />
      <input 
        data-testid="filter-breed" 
        value={breed} 
        onChange={(e) => setBreed(e.target.value)} 
        placeholder="Filtrar por raça"
        disabled={loadingPets}
      />
      <button data-testid="filter-button" onClick={handleFilter}>Filtrar</button>
    </div>
  ),
}))

const getPetsMock = vi.fn()
const setNameMock = vi.fn()
const setBreedMock = vi.fn()
const setLoadingPetsMock = vi.fn()

vi.mock('@/hooks/usePets', () => ({
  usePets: () => ({
    pets: [
      { id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 3, foto: { url: 'rex.jpg' } },
      { id: 2, nome: 'Bob', raca: 'Beagle', idade: 2, foto: null },
    ],
    getPets: getPetsMock,
    total: 2,
    size: 10,
    onPageChange: vi.fn(),
    nextPage: 1,
    first: 0,
    loadingPets: false,
    setName: setNameMock,
    setBreed: setBreedMock,
    name: '',
    breed: '',
    setLoadingPets: setLoadingPetsMock,
  }),
}))

vi.mock('@/services/tutors/tutors.service', () => ({
  getTutor: vi.fn(),
  linkingTutorToPet: vi.fn(),
  unlinkingTutorToPet: vi.fn(),
}))

const handleErrorMock = vi.fn()
vi.mock('@/hooks/useHandleError', () => ({
  useErrorHandler: () => ({ handleError: handleErrorMock }),
}))

describe('PetLinkDialog Component', () => {
  let getPetsMock: any
  let setNameMock: any
  let setBreedMock: any
  // let setLoadingPetsMock: any

  const defaultProps = {
    isOpen: true,
    tutorId: 1,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    getPetsMock = vi.mocked(usePets().getPets)
    setNameMock = vi.mocked(usePets().setName)
    setBreedMock = vi.mocked(usePets().setBreed)
    // setLoadingPetsMock = vi.mocked(usePets().setLoadingPets)
    
    vi.mocked(tutorsService.getTutor).mockResolvedValue({
      id: 1,
      nome: 'João',
      pets: [
        { id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 3, foto: { url: 'rex.jpg' } },
      ],
    } as any)
  })

  it('Deve renderizar o dialog quando isOpen for true', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-header', 'Vincular um Pet')
  })

  it('Não deve renderizar o dialog quando isOpen for false', () => {
    render(<PetLinkDialog {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('Deve chamar getTutor e getPets quando o dialog for aberto', async () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    await waitFor(() => {
      expect(vi.mocked(tutorsService.getTutor)).toHaveBeenCalledWith(1)
    })
    
    expect(getPetsMock).toHaveBeenCalled()
  })

  it('Deve renderizar os filtros de pet', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    expect(screen.getByTestId('pet-filters')).toBeInTheDocument()
    expect(screen.getByTestId('filter-name')).toBeInTheDocument()
    expect(screen.getByTestId('filter-breed')).toBeInTheDocument()
  })

  it('Deve renderizar a tabela de pets', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    expect(screen.getByTestId('datatable')).toBeInTheDocument()
    expect(screen.getByTestId('row-1')).toBeInTheDocument()
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
  })

  it('Deve renderizar os checkboxes para seleção', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    expect(screen.getByTestId('checkbox-1')).toBeInTheDocument()
    expect(screen.getByTestId('checkbox-2')).toBeInTheDocument()
  })

  it('Deve selecionar um pet quando o checkbox for marcado', async () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    await waitFor(() => {
      const checkbox = screen.getByTestId('checkbox-2') as HTMLInputElement
      fireEvent.click(checkbox)
      
      expect(vi.mocked(tutorsService.linkingTutorToPet)).toHaveBeenCalledWith({ tutorId: 1, petId: 2 })
    })
  })

  it('Deve deselecionar um pet quando o checkbox for desmarcado', async () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    await waitFor(() => {
      const checkbox = screen.getByTestId('checkbox-1') as HTMLInputElement
      fireEvent.click(checkbox)
      
      expect(vi.mocked(tutorsService.unlinkingTutorToPet)).toHaveBeenCalledWith({ tutorId: 1, petId: 1 })
    })
  })

  it('Deve chamar onClose quando o botão de fechar for clicado', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    const closeButton = screen.getByTestId('close-button')
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('Deve limpar os filtros quando o dialog for fechado', () => {
    const { rerender } = render(<PetLinkDialog {...defaultProps} />)
    
    rerender(<PetLinkDialog {...defaultProps} isOpen={false} />)
    
    expect(setNameMock).toHaveBeenCalledWith('')
    expect(setBreedMock).toHaveBeenCalledWith('')
  })

  it('Deve lidar com erro ao buscar tutor', async () => {
    vi.mocked(tutorsService.getTutor).mockRejectedValueOnce(new Error('Erro ao buscar tutor'))
    
    render(<PetLinkDialog {...defaultProps} />)
    
    await waitFor(() => {
      expect(vi.mocked(tutorsService.getTutor)).toHaveBeenCalledWith(1)
    })
  })

  it('Deve ter a classe CSS correta para o DataTable', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    expect(screen.getByTestId('datatable')).toHaveClass('pet-link-table')
  })

  it('Deve renderizar o avatar quando o pet tem foto', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    const avatar = screen.getAllByTestId('avatar')[0]
    expect(avatar).toHaveAttribute('data-image', 'rex.jpg')
  })

  it('Deve renderizar o avatar vazio quando o pet não tem foto', () => {
    render(<PetLinkDialog {...defaultProps} />)
    
    const avatar = screen.getAllByTestId('avatar')[1]
    expect(avatar).toHaveAttribute('data-image', '')
  })
})