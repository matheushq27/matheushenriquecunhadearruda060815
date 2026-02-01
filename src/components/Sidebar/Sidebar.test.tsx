import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from './Sidebar'

//mock do navigate
const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({ pathname: '/' }),
}))

//mock do Menu do PrimeReact
vi.mock('primereact/menu', () => ({
  Menu: ({ model }: any) => (
    <div>
      {model.map((item: any, index: number) => {
        if (item.label) {
          return (
            <button
              key={index}
              onClick={item.command}
            >
              {item.label}
            </button>
          )
        }

        return null
      })}
    </div>
  ),
}))

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Deve renderizar o componente Sidebar', () => {
    render(<Sidebar />)

    // verifica se pelo menos um item de menu existe
    expect(screen.getByText('Tutores')).toBeInTheDocument()
    expect(screen.getByText('Pets')).toBeInTheDocument()
  })

  it('Deve navegar para /tutors ao clicar em Tutores', () => {
    render(<Sidebar />)

    fireEvent.click(screen.getByText('Tutores'))

    expect(navigateMock).toHaveBeenCalledWith('/tutors')
  })

  it('Deve navegar para /pets ao clicar em Pets', () => {
    render(<Sidebar />)

    fireEvent.click(screen.getByText('Pets'))

    expect(navigateMock).toHaveBeenCalledWith('/pets')
  })
})
