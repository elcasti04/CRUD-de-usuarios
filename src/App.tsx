import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Label } from './components/ui/label'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { cn } from './lib/utils'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  birthday: z.string().refine((date) => {
    const parsedDate = Date.parse(date)
    return !isNaN(parsedDate)
  }, 'Invalid date format'),
  img_url: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

interface User extends FormData {
  id: number
}

const generateId = (arr: any) => {
  let id = 1
  if (arr.length > 0) id = arr[arr.length - 1].id + 1
  return id
}

const baseUrl = 'http://localhost:4000/users'

// usuarios de prueba
const defaultUsers: User[] = [
  {
    id: 1,
    name: 'fabian franco',
    email: 'fabian@example.com',
    password: '123456',
    birthday: '1990-01-01',
    img_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=John'
  },
  {
    id: 2,
    name: 'jose rulo',
    email: 'rulo@example.com',
    password: 'abcdef',
    birthday: '1995-05-15',
    img_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jane'
  }
]

// lista de avatares disponibles
// lista de avatares disponibles (ahora con estilo como el de la imagen)
const avatarOptions = [
 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aurora',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leonardo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Valeria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriela',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nicolas',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Thiago',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Adrian',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Martina',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Julieta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Andres',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Florencia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sebastian',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Paula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria'
]

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [isEdited, setIsEdited] = useState<null | number>(null)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // READ
  useEffect(() => {
    axios.get(baseUrl)
      .then(res => {
        if (res.data.length === 0) {
          defaultUsers.forEach(async (u) => {
            try {
              await axios.post(baseUrl, u)
            } catch (err) {
              console.error('Error insertando usuario por defecto:', err)
            }
          })
          setUsers(defaultUsers)
        } else {
          setUsers(res.data)
        }
      })
      .catch(() => {
        console.warn('No se pudo conectar a json-server, usando usuarios por defecto')
        setUsers(defaultUsers)
      })
  }, [])

  // Form setup
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', birthday: '', img_url: '' }
  })

  const selectedAvatar = watch('img_url')

  const onSubmit = (dataForm: FormData): void => {
    if (isEdited) {
      updateUser(dataForm, isEdited)
    } else {
      createUser(dataForm)
    }
    reset({ name: '', email: '', password: '', birthday: '', img_url: '' })
  }

  // CRUD Operations
  const createUser = async (dataForm: FormData): Promise<void> => {
    const newUser: User = { id: generateId(users), ...dataForm }
    try {
      const res = await axios.post(baseUrl, newUser)
      setUsers([...users, res.data])
    } catch (err) {
      console.warn('No se pudo guardar en API, agregando solo en memoria')
      setUsers([...users, newUser])
    }
  }

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}/${id}`)
    } catch (err) {
      console.warn('No se pudo borrar en API, borrando solo en memoria')
    }
    setUsers(users.filter(u => u.id !== id))
  }

  const onEdit = (user: User): void => {
    reset(user)
    setIsEdited(user.id)
  }

  const updateUser = async (dataForm: FormData, id: number): Promise<void> => {
    if (!dataForm) return
    const updatedUser: User = { id, ...dataForm }
    try {
      const res = await axios.put(`${baseUrl}/${id}`, updatedUser)
      setUsers(users.map(u => u.id === id ? res.data : u))
    } catch (err) {
      console.warn('No se pudo actualizar en API, actualizando solo en memoria')
      setUsers(users.map(u => u.id === id ? updatedUser : u))
    }
    setIsEdited(null)
  }

  const onCancel = () => {
    reset({ name: '', email: '', password: '', birthday: '', img_url: '' })
    setIsEdited(null)
  }

  return (
    <div>
      {/* formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm mx-auto mt-10 p-4 border border-gray-300 rounded'>

        <div className="flex flex-col gap-1 mb-4">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name &&
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          }
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email &&
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          }
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password &&
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          }
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <Label htmlFor="birthday">Birthday</Label>
          <Input id="birthday" type="date" {...register('birthday')} />
          {errors.birthday &&
            <p className="text-red-500 text-xs mt-1">{errors.birthday.message}</p>
          }
        </div>

        {/* Avatar */}
        <div className="flex flex-col gap-1 mb-4">
          <Label>Avatar</Label>
          <div
            className="w-20 h-20 border rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => setShowAvatarPicker(true)}
          >
            {selectedAvatar ? (
              <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">Choose</span>
            )}
          </div>
          <Input type="hidden" {...register('img_url')} />
        </div>

        {showAvatarPicker && (
          <div className="flex gap-2 flex-wrap mb-4">
            {avatarOptions.map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt={`avatar-${i}`}
                className="w-16 h-16 rounded-full border cursor-pointer hover:scale-110 transition"
                onClick={() => {
                  setValue('img_url', avatar)
                  setShowAvatarPicker(false)
                }}
              />
            ))}
          </div>
        )}

        <Button variant='outline' type="submit" className={cn(
          'text-white bg-blue-500 hover:bg-blue-600 hover:text-white',
          isEdited && 'bg-amber-400 text-black hover:bg-amber-500 hover:text-black'
        )}>
          {isEdited ? 'Update User' : 'Create User'}
        </Button>

        {isEdited && (
          <Button variant='ghost' type="button" className='ml-2' onClick={onCancel}>
            Cancel
          </Button>
        )}
      </form>

      {/* lista de usuarios debajo del formulario */}
      <div className='max-w-sm mx-auto mt-10 py-4'>
        <h2 className='text-2xl font-semibold mb-4'>Users</h2>

        <div className='grid gap-4'>
          {users && users.length > 0 ? (
            users.map((u) => (
              <div key={u.id} className='border p-4 rounded'>
                <p><strong>Name:</strong> {u.name}</p>
                <p><strong>Email:</strong> {u.email}</p>
                <p><strong>Password:</strong> {u.password}</p>
                <p><strong>Birthday:</strong> {u.birthday}</p>
                {u.img_url && <img src={u.img_url} alt={u.name} className='w-20 h-20 object-cover rounded-full mt-2' />}
                <div className='mt-2 flex gap-2'>
                  <Button variant='destructive' onClick={() => deleteUser(u.id)}>
                    Delete
                  </Button>
                  <Button variant='secondary' onClick={() => onEdit(u)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>No users yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
