<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabase()
const toast = useToast()
const loading = ref(false)

// Estado del formulario de nueva noticia
const state = reactive({
  name: '',
  description: ''
})

// Crear nueva noticia en la base de datos
async function onSubmit() {
  loading.value = true
  try {
    const { error } = await supabase
      .from('news')
      .insert({
        name: state.name,
        description: state.description
      })

    if (error) throw error

    toast.add({ title: 'Creada', description: 'Noticia creada correctamente', color: 'success' })
    navigateTo('/admin/news')
  } catch (e: any) {
    toast.add({ title: 'Error', description: e.message || 'No se pudo crear la noticia', color: 'error' })
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
        Nueva Noticia
      </h1>
    </div>

    <UCard class="max-w-2xl">
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
            label="Crear Noticia"
            icon="i-lucide-check"
            :loading="loading"
          />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
