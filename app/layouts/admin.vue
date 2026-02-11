<script setup lang="ts">
// Obtener datos del usuario autenticado
const { profile, logout } = useAuth()
const route = useRoute()

// Enlaces de navegacion del panel admin
const navItems = [
  { label: 'Dashboard', to: '/admin', icon: 'i-lucide-layout-dashboard' },
  { label: 'Eventos', to: '/admin/events', icon: 'i-lucide-calendar' },
  { label: 'Noticias', to: '/admin/news', icon: 'i-lucide-newspaper' }
]

// Verificar si un enlace esta activo
function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen flex bg-neutral-950">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0">
      <!-- Logo -->
      <div class="p-6 border-b border-neutral-800">
        <NuxtLink to="/admin">
          <img src="/white-logo.png" alt="DJ Fishman" class="h-8 w-auto">
        </NuxtLink>
        <p class="text-xs text-neutral-500 mt-1">
          Panel de Administracion
        </p>
      </div>

      <!-- Navegacion -->
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-amber-500/10 text-amber-500'
            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'"
        >
          <UIcon :name="item.icon" class="text-lg" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Usuario -->
      <div class="p-4 border-t border-neutral-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-user" class="text-amber-500" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">
              {{ profile?.name || 'Admin' }}
            </p>
            <p class="text-xs text-neutral-500 truncate">
              {{ profile?.email }}
            </p>
          </div>
        </div>
        <UButton
          label="Cerrar Sesion"
          icon="i-lucide-log-out"
          color="neutral"
          variant="ghost"
          size="sm"
          block
          @click="logout"
        />
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="flex-1 overflow-auto">
      <div class="p-6 md:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
