<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'DJ Fishman | Crossover DJ'
const description = 'DJ Fishman - Crossover DJ. Eventos, música y noticias. Contrataciones y booking.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const route = useRoute()

// Verificar si la ruta actual es del panel admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Eventos', to: '/#eventos' },
  { label: 'Noticias', to: '/#noticias' }
]

const socialLinks = [
  { icon: 'i-simple-icons-instagram', to: '#', label: 'Instagram' },
  { icon: 'i-simple-icons-soundcloud', to: '#', label: 'SoundCloud' },
  { icon: 'i-simple-icons-youtube', to: '#', label: 'YouTube' }
]
</script>

<template>
  <UApp>
    <!-- Sitio publico -->
    <template v-if="!isAdminRoute">
      <UHeader>
        <template #left>
          <NuxtLink to="/">
            <AppLogo />
          </NuxtLink>
        </template>

        <template #center>
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.label"
              :to="link.to"
              class="text-sm font-medium text-neutral-400 hover:text-primary transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </template>

        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              v-for="social in socialLinks"
              :key="social.label"
              :to="social.to"
              target="_blank"
              :icon="social.icon"
              :aria-label="social.label"
              color="neutral"
              variant="ghost"
              size="sm"
            />
            <UColorModeButton />
          </div>
        </template>
      </UHeader>

      <UMain>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>

      <footer class="border-t border-neutral-800 bg-neutral-950/50">
        <div class="max-w-7xl mx-auto px-4 py-10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex flex-col items-center md:items-start gap-2">
              <img src="/silver-logo.png" alt="DJ Fishman" class="h-10 w-auto">
              <p class="text-sm text-neutral-500">
                Crossover DJ
              </p>
            </div>

            <div class="flex items-center gap-3">
              <UButton
                v-for="social in socialLinks"
                :key="social.label"
                :to="social.to"
                target="_blank"
                :icon="social.icon"
                :aria-label="social.label"
                color="neutral"
                variant="ghost"
              />
            </div>

            <p class="text-sm text-neutral-500">
              &copy; {{ new Date().getFullYear() }} DJ Fishman. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </template>

    <!-- Panel admin -->
    <template v-else>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
  </UApp>
</template>
