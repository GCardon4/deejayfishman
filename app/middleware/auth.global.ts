export default defineNuxtRouteMiddleware(async (to) => {
  // Solo proteger rutas que empiezan con /admin
  if (!to.path.startsWith('/admin')) return

  // Saltar verificacion en servidor (admin usa ssr: false)
  if (import.meta.server) return

  const supabase = useSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  // Sin sesion activa, redirigir a login
  if (!user) {
    return navigateTo('/login')
  }

  // Verificar rol de administrador
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role_id')
    .eq('id', user.id)
    .single()

  if (!profileData || profileData.role_id !== 1) {
    return navigateTo('/')
  }
})
