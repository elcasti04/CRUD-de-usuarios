// Primitive types
let nombre: string = 'Ana'
let edad: number = 20
let esActivo: boolean = true
let nada: null = null
let indefinido: undefined = undefined

// Arrays
const letters: Array<string> = ['a', 'b', 'c']
const numbers: number[] = [1, 2, 3]

// Objects
let persona: { nombre: string, edad: number } = {
  nombre: 'Ana',
  edad: 20
}

// Tuplas
let usuarios: [string, number, boolean] = ['Ana', 20, true]

console.log(usuarios)

// Union types
let statusCode: number | string = 200

if (statusCode === 200) {
  statusCode = 'Ok'
}

console.log(statusCode)

const array: (string | number | boolean)[] = [123, 'abc', true, 20]

// Intersection types
type Usuario = {
  nombre: string
}

type Admin = {
  permisos: string[]
}

type UsuarioAdmin = Usuario & Admin

const admin: UsuarioAdmin = {
  nombre: 'Ana',
  permisos: ['leer', 'editar']
}

// Typeof
const student = {
  nombre: 'Ana',
  edad: 20,
  esActivo: true,
  cursos: ['TypeScript', 'JavaScript'],
  direccion: {
    calle: 'Calle Falsa 123',
    ciudad: 'Springfield'
  }
}

type Student = typeof student

function imprimirEstudiante (estudiante: Student) {
  console.log(`Nombre: ${estudiante.nombre}`)
}

// Con valores de retorno
function crearUsuario (nombre: string, edad: number) {
  return { nombre, edad, activo: true }
}

// Extrae el tipo de retorno de la función
type UsuarioCreado = ReturnType<typeof crearUsuario>

const nuevo: UsuarioCreado = {
  nombre: 'Carlos',
  edad: 22,
  activo: true
}

// keyof
type Person = {
  id: number
  nombre: string
  activo: boolean
}

// keyof → "id" | "nombre" | "activo"
type ClavesUsuario = keyof Person

function obtenerValor (obj: Person, key: ClavesUsuario) {
  return obj[key]
}

const user: Person = {
  id: 1,
  nombre: 'Ana',
  activo: true
}

console.log(obtenerValor(user, 'nombre')) // Ana

// Funciones tipadas
function saludar (nombre: string | number): void {
  console.log(`Hola, ${nombre}`)
}

saludar('Ana')

function sumar (a: number, b: number): number | string {
  return `${a + b}`
}

console.log(sumar(2, 3)) // 5

// Callbacks
function procesarNumeros (numeros: number[], callback: (n: number) => number): number[] {
  return numeros.map(callback)
}

const duplicados = procesarNumeros([1, 2, 3], (n: number) => n * 2)

console.log(duplicados) // [2, 4, 6] 

// Interfaces
interface Producto {
  id: number
  nombre: string
  precio: number
  descripcion?: string // Propiedad opcional
}

// otro archivo .ts
interface Producto {
  categoria?: string
}

const producto: Producto = {
  id: 1,
  nombre: 'Laptop',
  precio: 999.99,
  descripcion: 'Una laptop potente'
}

interface ProductoConDescuento extends Producto {
  descuento: number
}

const productoDescuento: ProductoConDescuento = {
  id: 2,
  nombre: 'Smartphone',
  precio: 499.99,
  descuento: 10
}

// Alias de tipos
type ID = string | number

const id: ID = 'asadasd-3242-asda-213323'

function obtenerProducto (id: ID) { }

// Tipos literales
type Status = 'completed' | 'pending' | 'cancel'

let statusTask: Status = 'pending'

statusTask = 'completed'

console.log(statusTask)

interface Address {
  calle: string
  ciudad: string
  residential: Residential
  addToCart: (productoId: number) => void
  renderItem: (itemId: number) => string
}

type Residential = {
  tipo: 'casa' | 'departamento'
  numero: number
}

// Enums

const Colores = {
  ROJO: 'rojo',
  VERDE: 'verde',
  AZUL: 'azul'
}

const colorFavorito = Colores.ROJO

console.log(colorFavorito) // rojo

// Genéricos
function identidad<T> (arg: T): T {
  return arg
}

const str = true

console.log(identidad<boolean>(str)) // Hola
console.log(identidad<number>(123)) // 123