import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  name: string
  email: string
  roleId: number
}

// Estado global reactivo del usuario
const user = ref<User | null>(null)
const profile = ref<Profile | null>(null)
const loading = ref(false)

export const useAuth = () => {
  const supabase = useSupabase()

  // Verificar si el usuario es administrador
  const isAdmin = computed(() => profile.value?.roleId === 1)

  // Obtener perfil del usuario desde la tabla profiles
  async function fetchProfile() {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
      user.value = null
      profile.value = null
      return
    }

    user.value = currentUser

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role_id')
      .eq('id', currentUser.id)
      .single()

    if (error) {
      console.error('Error al obtener perfil:', error)
      return
    }

    profile.value = {
      id: data.id,
      name: data.name,
      email: data.email,
      roleId: data.role_id
    }
  }

  // Iniciar sesion con email y contrasena
  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await fetchProfile()
    } finally {
      loading.value = false
    }
  }

  // Cerrar sesion y limpiar estado
  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    navigateTo('/login')
  }

  return {
    user,
    profile,
    loading,
    isAdmin,
    login,
    logout,
    fetchProfile
  }
}
