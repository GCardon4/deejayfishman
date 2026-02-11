<script setup lang="ts">
const { login, loading, isAdmin, fetchProfile } = useAuth()
const toast = useToast()

const error = ref('')

const state = reactive({
  email: '',
  password: ''
})

// Verificar si ya esta autenticado al cargar
onMounted(async () => {
  await fetchProfile()
  if (isAdmin.value) {
    navigateTo('/admin')
  }
})

// Manejar envio del formulario de login
async function onSubmit() {
  error.value = ''
  try {
    await login(state.email, state.password)
    if (isAdmin.value) {
      toast.add({ title: 'Bienvenido', description: 'Sesion iniciada correctamente', color: 'success' })
      navigateTo('/admin')
    } else {
      error.value = 'No tienes permisos de administrador'
    }
  } catch (e: any) {
    error.value = e.message === 'Invalid login credentials'
      ? 'Email o contrasena incorrectos'
      : e.message || 'Error al iniciar sesion'
  }
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <UCard class="w-full max-w-md">
      <div class="text-center mb-6">
        <img src="/white-logo.png" alt="DJ Fishman" class="h-12 w-auto mx-auto mb-4">
        <h1 class="text-2xl font-bold">
          Iniciar Sesion
        </h1>
        <p class="text-neutral-400 text-sm mt-1">
          Panel de Administracion
        </p>
      </div>

      <UAlert
        v-if="error"
        color="error"
        icon="i-lucide-alert-circle"
        :title="error"
        class="mb-4"
      />

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="tu@email.com"
            icon="i-lucide-mail"
            size="lg"
          />
        </UFormField>

        <UFormField label="Contrasena" name="password" required>
          <UInput
            v-model="state.password"
            type="password"
            placeholder="********"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Ingresar"
          icon="i-lucide-log-in"
          size="lg"
          block
          :loading="loading"
        />
      </UForm>
    </UCard>
  </div>
</template>
