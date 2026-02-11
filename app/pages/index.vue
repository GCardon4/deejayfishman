<script setup lang="ts">
const supabase = useSupabase()

const { data: events, pending: loadingEvents } = useAsyncData('events', async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date_event', { ascending: true })
    .limit(6)

  if (error) throw error
  return data
})

const { data: news, pending: loadingNews } = useAsyncData('news', async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw error
  return data
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatPrice(price: number | null) {
  if (!price) return 'Gratis'
  return `$${price.toLocaleString('es-AR')}`
}
</script>

<template>
  <div>
    <!-- HERO - Presentación DJ -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-transparent" />
      <div class="max-w-7xl mx-auto px-4 py-20 md:py-32 relative">
        <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <!-- Foto de perfil -->
          <div class="shrink-0">
            <div class="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-amber-500/30 shadow-2xl shadow-amber-500/10">
              <img
                src="/profile-one.JPG"
                alt="DJ Fishman"
                class="w-full h-full object-cover"
              >
            </div>
          </div>

          <!-- Info -->
          <div class="text-center md:text-left">
            <img
              src="/white-logo.png"
              alt="DJ Fishman"
              class="h-14 md:h-20 w-auto mx-auto md:mx-0 mb-4"
            >

            <p class="text-xl md:text-2xl text-amber-400 font-medium mb-3">
              Crossover DJ
            </p>

            <p class="text-neutral-400 max-w-lg mb-8">
              Mezclando los mejores ritmos para tus eventos. Música que cruza fronteras y géneros. Rey DJs de mi tierra.
            </p>

            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <UButton
                to="/#eventos"
                label="Ver Eventos"
                trailing-icon="i-lucide-arrow-down"
                size="xl"
              />
              <UButton
                to="#"
                label="Contactar"
                icon="i-lucide-mail"
                size="xl"
                color="neutral"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN EVENTOS -->
    <section id="eventos" class="border-t border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div class="text-center mb-12">
          <span class="text-amber-500 text-sm font-semibold tracking-widest uppercase">Agenda</span>
          <h2 class="text-3xl md:text-4xl font-bold mt-2">
            Próximos Eventos
          </h2>
          <p class="text-neutral-400 mt-3 max-w-lg mx-auto">
            No te pierdas las próximas presentaciones y fiestas.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loadingEvents" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <USkeleton v-for="i in 3" :key="i" class="h-52 rounded-xl" />
        </div>

        <!-- Events Grid -->
        <div v-else-if="events?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="event in events"
            :key="event.id"
            class="hover:border-amber-500/30 transition-colors"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2 text-amber-500">
                <UIcon name="i-lucide-calendar" class="text-lg" />
                <span class="text-sm font-medium">
                  {{ event.date_event ? formatDate(event.date_event) : 'Fecha por confirmar' }}
                </span>
              </div>

              <h3 class="text-lg font-semibold">
                {{ event.name || 'Evento sin nombre' }}
              </h3>

              <p v-if="event.description" class="text-neutral-400 text-sm line-clamp-3">
                {{ event.description }}
              </p>

              <div class="flex items-center justify-between pt-2 border-t border-neutral-800">
                <span class="text-amber-400 font-semibold">
                  {{ formatPrice(event.price) }}
                </span>
                <UButton
                  label="Ver más"
                  variant="ghost"
                  size="xs"
                  trailing-icon="i-lucide-arrow-right"
                />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <UIcon name="i-lucide-calendar-x" class="text-5xl text-neutral-600 mb-4" />
          <p class="text-neutral-500 text-lg">
            No hay eventos programados por el momento.
          </p>
          <p class="text-neutral-600 text-sm mt-1">
            Seguinos en redes para enterarte de las próximas fechas.
          </p>
        </div>
      </div>
    </section>

    <!-- SECCIÓN NOTICIAS -->
    <section id="noticias" class="border-t border-neutral-800 bg-neutral-950/50">
      <div class="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div class="text-center mb-12">
          <span class="text-amber-500 text-sm font-semibold tracking-widest uppercase">Novedades</span>
          <h2 class="text-3xl md:text-4xl font-bold mt-2">
            Últimas Noticias
          </h2>
          <p class="text-neutral-400 mt-3 max-w-lg mx-auto">
            Enterate de todo lo que pasa en el mundo de DJ Fishman.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loadingNews" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <USkeleton v-for="i in 3" :key="i" class="h-44 rounded-xl" />
        </div>

        <!-- News Grid -->
        <div v-else-if="news?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="item in news"
            :key="item.id"
            class="hover:border-amber-500/30 transition-colors"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2 text-neutral-500">
                <UIcon name="i-lucide-newspaper" class="text-lg" />
                <span class="text-xs">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>

              <h3 class="text-lg font-semibold">
                {{ item.name || 'Sin título' }}
              </h3>

              <p v-if="item.description" class="text-neutral-400 text-sm line-clamp-4">
                {{ item.description }}
              </p>

              <div class="pt-2">
                <UButton
                  label="Leer más"
                  variant="ghost"
                  size="xs"
                  trailing-icon="i-lucide-arrow-right"
                />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <UIcon name="i-lucide-newspaper" class="text-5xl text-neutral-600 mb-4" />
          <p class="text-neutral-500 text-lg">
            No hay noticias publicadas aún.
          </p>
          <p class="text-neutral-600 text-sm mt-1">
            Pronto tendremos novedades para compartir.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
