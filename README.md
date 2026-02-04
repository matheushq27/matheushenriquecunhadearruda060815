# Tutorpet Management System
Sistema de gerenciamento de pets e tutores desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias Utilizadas

- **React 19** com TypeScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **PrimeReact** - Componentes UI
- **Zustand** - Gerenciamento de estado
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Vitest** - Framework de testes
- **Lucide React** - Ícones

## 📁 Estrutura da Arquitetura

```
src/
├── assets/              # Arquivos estáticos (imagens, fonts)
├── components/          # Componentes React reutilizáveis
│   ├── AvatarEdit/    # Componente de edição de avatar
│   ├── CardView/      # Componente de visualização em cards
│   ├── DialogForm/    # Componente de diálogo para formulários
│   ├── FormField/     # Componente de campo de formulário
│   ├── Header/        # Componente de cabeçalho
│   ├── NoRecordsFound/ # Componente para quando não há registros
│   ├── PetFilters/    # Componente de filtros para pets
│   ├── PetForm/       # Componente de formulário de pets
│   ├── PetLinkDialog/ # Componente de diálogo para vincular pets
│   ├── Ready/         # Componente de estado pronto
│   ├── SectionLoading/ # Componente de carregamento de seção
│   ├── Sidebar/       # Componente de navegação lateral
│   └── TutorForm/     # Componente de formulário de tutores
├── contexts/          # Contextos React
├── helpers/           # Funções utilitárias
├── hooks/             # Hooks customizados
│   ├── usePagination.ts # Hook para paginação
│   └── usePets.ts     # Hook para operações com pets
├── interfaces/        # Interfaces TypeScript
│   ├── entities/      # Entidades do sistema
│   ├── services/      # Interfaces de serviços
│   ├── stores/        # Interfaces de stores
│   └── utils/         # Interfaces utilitárias
├── layouts/           # Layouts principais
├── pages/             # Páginas da aplicação
│   ├── Home.tsx       # Página inicial
│   ├── Login.tsx      # Página de login
│   ├── Pets.tsx       # Página de listagem de pets
│   ├── PetDetail.tsx  # Página de detalhes do pet
│   └── Tutors.tsx     # Página de listagem de tutores
├── routes/            # Configuração de rotas
│   └── AppRoutes.tsx  # Rotas principais da aplicação
├── services/          # Serviços de API
│   ├── authenticate/  # Serviços de autenticação
│   ├── pets/         # Serviços de pets
│   └── tutors/       # Serviços de tutores
└── stores/           # Stores Zustand
    ├── auth.store.ts # Store de autenticação
    ├── pets.store.ts # Store de pets
    └── tutors.store.ts # Store de tutores
```

## 🏗️ Arquitetura

### Padrões Implementados

1. **Component-Based Architecture**: Componentes React modulares e reutilizáveis
2. **Separation of Concerns**: Separação clara entre apresentação, lógica e dados
3. **Type Safety**: TypeScript em todo o projeto
4. **State Management**: Zustand para gerenciamento de estado global
5. **Responsive Design**: Mobile-first com Tailwind CSS
6. **Lazy Loading**: Carregamento sob demanda de módulos

### Fluxo de Dados

```
UI Components → Hooks → Services → API
     ↓
Zustand Stores ← Hooks ← Services
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd matheushenriquecunhadearruda060815
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### Desenvolvimento

Execute o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### Build de Produção

```bash
npm run build
```

O build será gerado na pasta `dist/`.

### Preview do Build

```bash
npm run preview
```

## 🧪 Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm test -- --watch
```

### Executar testes com coverage

```bash
npm test -- --coverage
```

### Executar testes específicos

```bash
npm test -- Header.test.tsx
```

## 📊 Requisitos Implementados

### ✅ Requisitos Gerais
- [x] TypeScript
- [x] Layout responsivo
- [x] Tailwind CSS
- [x] Lazy Loading Routes
- [x] Paginação
- [x] Requisições em tempo real (Axios)
- [x] Testes unitários
- [x] Organização e componentização

### ✅ Requisitos Específicos
- [x] Listagem de Pets com cards
- [x] GET /v1/pets
- [x] Paginação (10 por página)
- [x] Busca por nome
- [x] Listagem de Tutores
- [x] Cadastro de Pets e Tutores
- [x] Autenticação

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm test` - Executa os testes

## 🔐 Autenticação

O sistema possui autenticação baseada em token com:
- Login de usuários
- Rotas protegidas
- Gerenciamento de sessão via Zustand

## 🐳 Docker

O projeto inclui Dockerfile para containerização:

```bash
docker compose up --build
```