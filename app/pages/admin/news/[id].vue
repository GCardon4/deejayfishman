<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const supabase = useSupabase()
const toast = useToast()
const loading = ref(false)

const newsId = route.params.id as string

// Estado del formulario de edicion
const state = reactive({
  name: '',
  description: ''
})

// Cargar datos de la noticia a editar
const { pending } = useAsyncData(`adminNews-${newsId}`, async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', newsId)
    .single()

  if (error) throw error

  state.name = data.name || ''
  state.description = data.description || ''

  return data
})

// Actualizar noticia en la base de datos
async function onSubmit() {
  loading.value = true
  try {
    const { error } = await supabase
      .from('news')
      .update({
        name: state.name,
        description: state.description
      })
      .eq('id', newsId)

    if (error) throw error

    toast.add({ title: 'Actualizada', description: 'Noticia actualizada correctamente', color: 'success' })
    navigateTo('/admin/news')
  } catch (e: any) {
    toast.add({ title: 'Error', description: e.message || 'No se pudo actualizar la noticia', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/admin/news"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
      />
      <h1 class="text-2xl font-bold">
        Editar Noticia
      </h1>
    </div>

    <div v-if="pending" class="max-w-2xl space-y-4">
      <USkeleton class="h-10 rounded-lg" />
      <USkeleton class="h-32 rounded-lg" />
    </div>

    <UCard v-else class="max-w-2xl">
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Titulo" name="name" required>
          <UInput v-model="state.name" placeholder="Titulo de la noticia" />
        </UFormField>

        <UFormField label="Contenido" name="description">
          <UTextarea v-model="state.description" placeholder="Contenido de la noticia" :rows="6" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton
            to="/admin/news"
            label="Cancelar"
            color="neutral"
            variant="ghost"
          />
          <UButton
            type="submit"
            label="Guardar Cambios"
            icon="i-lucide-check"
            :loading="loading"
          />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
