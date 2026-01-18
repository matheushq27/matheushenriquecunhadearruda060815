export interface Tutor {
  id: number
  nome: string
  email: string
  telefone: string
  endereco: string
  cpf: number
  foto: Foto | null
  pets?: Pet[]
}

export interface Photo {
  id: number
  nome: string
  contentType: string
  url: string
}

export interface Pet {
  id: number
  nome: string
  raca: string
  idade: number
  foto: Photo
}

