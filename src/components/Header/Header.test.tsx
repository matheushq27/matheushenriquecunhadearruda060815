import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'

//Mock do navigate
const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

//Mock do Zustand
const logoutMock = vi.fn()

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: (selector: any) =>
    selector({
      logout: logoutMock,
    }),
}))

//Mock PrimeReact Sidebar (portal)
vi.mock('primereact/sidebar', () => ({
  Sidebar: ({ visible, children }: any) =>
    visible ? <div data-testid="sidebar">{children}</div> : null,
}))

//Mock PanelMenu
vi.mock('primereact/panelmenu', () => ({
  PanelMenu: ({ model }: any) => (
    <div>
      {model.map((item: any) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </div>
  ),
}))

//Mock Button
vi.mock('primereact/button', () => ({
  Button: ({ label, icon, onClick }: any) => (
    <button onClick={onClick}>
      {label || icon}
    </button>
  ),
}))

describe('Header component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Deve renderizar o botão de menu e o botão de logout', () => {
    render(<Header />)

    expect(screen.getByText('pi pi-bars')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
  })

  it('Deve abrir o sidebar quando o botão de menu é clicado', () => {
    render(<Header />)

    fireEvent.click(screen.getByText('pi pi-bars'))

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('Deve chamar o logout quando o botão de logout é clicado', () => {
    render(<Header />)

    fireEvent.click(screen.getByText('Sair'))

    expect(logoutMock).toHaveBeenCalledTimes(1)
  })

  it('Deve renderizar os itens do menu do sidebar', () => {
    render(<Header />)

    fireEvent.click(screen.getByText('pi pi-bars'))

    expect(screen.getByText('Tutores')).toBeInTheDocument()
    expect(screen.getByText('Pets')).toBeInTheDocument()
  })
})
