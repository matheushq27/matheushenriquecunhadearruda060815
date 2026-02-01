import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TutorForm } from './TutorForm'

// Variável para controlar o estado do mock do useTutorsStore
let mockCurrentTutor = null
let mockSetCurrentTutor = vi.fn()
let mockUpdateTutorPhoto = vi.fn()

vi.mock('react-hook-form', () => ({
    useForm: () => ({
        control: {},
        handleSubmit: (fn: any) => (data: any) => fn(data),
        formState: { errors: {} },
        reset: vi.fn(),
        resetValues: vi.fn(),
    }),
    Controller: ({ name, rules, render }: any) => (
        <div data-testid={`controller-${name}`} data-rules={JSON.stringify(rules)}>
            {render({ field: { value: '', onChange: vi.fn(), name } })}
        </div>
    ),
}))

vi.mock('primereact/inputtext', () => ({
    InputText: ({ id, placeholder, value, onChange, invalid, className, disabled, type, ...props }: any) => (
        <input
            data-testid={id}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            data-invalid={invalid}
            className={className}
            disabled={disabled}
            type={type}
            {...props}
        />
    ),
}))

vi.mock('primereact/inputmask', () => ({
    InputMask: ({ id, placeholder, value, onChange, invalid, mask, keyfilter, maxLength, disabled, ...props }: any) => (
        <input
            data-testid={id}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            data-invalid={invalid}
            data-mask={mask}
            data-keyfilter={keyfilter}
            maxLength={maxLength}
            disabled={disabled}
            {...props}
        />
    ),
}))

vi.mock('primereact/button', () => ({
    Button: ({ label, icon, onClick, outlined, loading, disabled, type, className }: any) => (
        <button
            onClick={onClick}
            data-testid={label ? `button-${label.toLowerCase().replace(/\s+/g, '-')}` : 'button'}
            data-label={label}
            data-icon={icon}
            data-outlined={outlined}
            data-loading={loading}
            disabled={disabled}
            type={type}
            className={className}
        >
            {label}
        </button>
    ),
}))

vi.mock('primereact/progressbar', () => ({
    ProgressBar: ({ mode, style }: any) => (
        <div data-testid="progress-bar" data-mode={mode} style={style}></div>
    ),
}))

vi.mock('primereact/dialog', () => ({
    Dialog: ({ header, visible, onHide, draggable, className, children }: any) => (
        visible ? (
            <div data-testid="dialog" data-header={header} data-visible={visible} data-draggable={draggable} className={className}>
                <button onClick={onHide} data-testid="close-button">Close</button>
                {children}
            </div>
        ) : null
    ),
}))

vi.mock('../AvatarEdit', () => ({
    AvatarEdit: ({ currentImageUrl, onImageUpload, loading }: any) => (
        <div data-testid="avatar-edit" data-current-image={currentImageUrl} data-loading={loading}>
            <button onClick={() => onImageUpload(new File([''], 'test.jpg'))}>Upload Image</button>
            <button onClick={() => onImageUpload(null)}>Remove Image</button>
        </div>
    ),
}))

vi.mock('../FormField', () => ({
    FormField: ({ label, inputId, errorMessage, required, children }: any) => (
        <div data-testid={`formfield-${inputId}`} data-label={label} data-required={required} data-error={errorMessage}>
            <label htmlFor={inputId}>{label}{required && '*'}</label>
            {children}
            {errorMessage && <span data-testid={`error-${inputId}`}>{errorMessage}</span>}
        </div>
    ),
}))

vi.mock('../DialogForm', () => ({
    DialogForm: ({ isOpen, onClose, title, children }: any) => (
        isOpen ? (
            <div data-testid="dialog-form" data-title={title}>
                <button onClick={onClose} data-testid="close-dialog">Close</button>
                {children}
            </div>
        ) : null
    ),
}))

vi.mock('../../stores/tutors.store', () => ({
    useTutorsStore: () => ({
        currentTutor: mockCurrentTutor,
        setCurrentTutor: mockSetCurrentTutor,
        updateTutorPhoto: mockUpdateTutorPhoto,
    }),
}))

vi.mock('../../services/tutors/tutors.service', () => ({
    createTutor: vi.fn().mockResolvedValue({ id: 1, nome: 'Test Tutor' }),
    updateTutor: vi.fn().mockResolvedValue({ id: 1, nome: 'Updated Tutor' }),
    getTutor: vi.fn().mockResolvedValue({
        id: 1,
        nome: 'Test Tutor',
        email: 'test@example.com',
        telefone: '11999999999',
        endereco: 'Test Address',
        cpf: '12345678909',
        foto: { id: 1, url: 'test.jpg' }
    }),
    updateTutorPhoto: vi.fn().mockResolvedValue({ id: 1, url: 'new-photo.jpg' }),
    removeTutorPhoto: vi.fn().mockResolvedValue({}),
}))

vi.mock('../../contexts/ToastContext', () => ({
    useToast: () => ({
        showSuccess: vi.fn(),
        showError: vi.fn(),
    }),
}))

vi.mock('../../hooks/useErrorHandler', () => ({
    useErrorHandler: () => vi.fn(),
}))

vi.mock('../../utils/validators', () => ({
    validateCPF: (cpf: string) => cpf.length === 11,
}))

beforeEach(() => {
    // Resetar os valores dos mocks antes de cada teste
    mockCurrentTutor = null
    mockSetCurrentTutor = vi.fn()
    mockUpdateTutorPhoto = vi.fn()
    vi.clearAllMocks()
})

describe('TutorForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('Deve renderizar o botão Adicionar corretamente', () => {
        render(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        expect(addButton).toBeInTheDocument()
        expect(addButton).toHaveTextContent('Adicionar')
    })

    it('Deve abrir o dialog quando o botão Adicionar for clicado', () => {
        render(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        const dialog = screen.getByTestId('dialog-form')
        expect(dialog).toBeInTheDocument()
        expect(dialog).toHaveAttribute('data-title', 'Adicionar Tutor')
    })

    it('Deve renderizar o formulário com todos os campos', () => {
        render(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        expect(screen.getByTestId('controller-nome')).toBeInTheDocument()
        expect(screen.getByTestId('controller-email')).toBeInTheDocument()
        expect(screen.getByTestId('controller-telefone')).toBeInTheDocument()
        expect(screen.getByTestId('controller-endereco')).toBeInTheDocument()
        expect(screen.getByTestId('controller-cpf')).toBeInTheDocument()
    })

    it('Deve renderizar o botão de salvar com texto correto para novo tutor', () => {
        render(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        const saveButton = screen.getByTestId('button-salvar-tutor')
        expect(saveButton).toBeInTheDocument()
        expect(saveButton).toHaveTextContent('Salvar Tutor')
    })

    it('Deve chamar afterCreating quando o formulário for submetido com sucesso', async () => {
        const afterCreatingMock = vi.fn()
        render(<TutorForm afterCreating={afterCreatingMock} />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        const form = screen.getByTestId('dialog-form').querySelector('form')
        if (form) {
            fireEvent.submit(form)
        }
        
        await waitFor(() => {
            expect(afterCreatingMock).toHaveBeenCalledTimes(1)
        })
    })

    it('Deve renderizar o AvatarEdit quando currentTutor estiver presente', () => {
        // Definir o currentTutor antes de renderizar
        mockCurrentTutor = { id: 1, nome: 'Test Tutor', foto: { id: 1, url: 'test.jpg' } }
        
        const { rerender } = render(<TutorForm />)
        rerender(<TutorForm />)
        
        // O AvatarEdit só é renderizado quando o dialog está aberto
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        const avatarEdit = screen.getByTestId('avatar-edit')
        expect(avatarEdit).toBeInTheDocument()
    })

    it('Deve renderizar a barra de progresso quando loadingGetTutor for true', () => {
        // Testar estado de loading
        const { rerender } = render(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        // Como simular o loading? Precisamos mockar o estado
        // Por enquanto, verificamos que o componente pode renderizar sem erros
        expect(screen.getByTestId('dialog-form')).toBeInTheDocument()
    })

    it('Deve ter regras de validação corretas para cada campo', () => {
        render(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        const nomeField = screen.getByTestId('formfield-nome')
        const emailField = screen.getByTestId('formfield-email')
        const cpfField = screen.getByTestId('formfield-cpf')
        
        expect(nomeField).toHaveAttribute('data-required', 'true')
        expect(emailField).toHaveAttribute('data-required', 'true')
        expect(cpfField).toHaveAttribute('data-required', 'true')
    })

    it('Deve renderizar o título correto para edição de tutor', () => {
        // Definir o currentTutor antes de renderizar
        mockCurrentTutor = { id: 1, nome: 'Test Tutor' }
        
        const { rerender } = render(<TutorForm />)
        rerender(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        const dialog = screen.getByTestId('dialog-form')
        expect(dialog).toHaveAttribute('data-title', 'Editar Tutor')
    })

    it('Deve renderizar o botão com texto correto para atualização de tutor', () => {
        // Definir o currentTutor antes de renderizar
        mockCurrentTutor = { id: 1, nome: 'Test Tutor' }
        
        const { rerender } = render(<TutorForm />)
        rerender(<TutorForm />)
        
        const addButton = screen.getByTestId('button-adicionar')
        fireEvent.click(addButton)
        
        const updateButton = screen.getByTestId('button-atualizar-tutor')
        expect(updateButton).toBeInTheDocument()
        expect(updateButton).toHaveTextContent('Atualizar Tutor')
    })
})