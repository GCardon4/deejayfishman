<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabase()

// Obtener conteo total de eventos
const { data: eventsCount } = useAsyncData('adminEventsCount', async () => {
  const { count, error } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
})

// Obtener conteo total de noticias
const { data: newsCount } = useAsyncData('adminNewsCount', async () => {
  const { count, error } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
})

// Tarjetas de resumen del dashboard
const cards = computed(() => [
  {
    label: 'Eventos',
    count: eventsCount.value ?? 0,
    icon: 'i-lucide-calendar',
    to: '/admin/events',
    color: 'text-amber-500'
  },
  {
    label: 'Noticias',
    count: newsCount.value ?? 0,
    icon: 'i-lucide-newspaper',
    to: '/admin/news',
    color: 'text-blue-500'
  }
])
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">
      Dashboard
    </h1>

    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <UCard v-for="card in cards" :key="card.label">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral-400">
              {{ card.label }}
            </p>
            <p class="text-3xl font-bold mt-1">
              {{ card.count }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
            <UIcon :name="card.icon" :class="card.color" class="text-2xl" />
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-neutral-800">
          <NuxtLink :to="card.to" class="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1">
            Gestionar {{ card.label.toLowerCase() }}
            <UIcon name="i-lucide-arrow-right" />
          </NuxtLink>
        </div>
      </UCard>
    </div>

    <!-- Accesos rapidos -->
    <h2 class="text-lg font-semibold mb-4">
      Acciones Rapidas
    </h2>
    <div class="flex flex-wrap gap-3">
      <UButton
        to="/admin/events/create"
        label="Nuevo Evento"
        icon="i-lucide-plus"
      />
      <UButton
        to="/admin/news/create"
        label="Nueva Noticia"
        icon="i-lucide-plus"
        color="neutral"
        variant="outline"
      />
      <UButton
        to="/"
        target="_blank"
        label="Ver Sitio"
        icon="i-lucide-external-link"
        color="neutral"
        variant="ghost"
      />
    </div>
  </div>
</template>
