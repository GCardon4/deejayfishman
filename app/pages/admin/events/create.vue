<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabase()
const toast = useToast()
const loading = ref(false)

// Estado del formulario de nuevo evento
const state = reactive({
  name: '',
  dateEvent: '',
  description: '',
  price: null as number | null
})

// Crear nuevo evento en la base de datos
async function onSubmit() {
  loading.value = true
  try {
    const { error } = await supabase
      .from('events')
      .insert({
        name: state.name,
        date_event: state.dateEvent || null,
        description: state.description,
        price: state.price
      })

    if (error) throw error

    toast.add({ title: 'Creado', description: 'Evento creado correctamente', color: 'success' })
    navigateTo('/admin/events')
  } catch (e: any) {
    toast.add({ title: 'Error', description: e.message || 'No se pudo crear el evento', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/admin/events"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
      />
      <h1 class="text-2xl font-bold">
        Nuevo Evento
      </h1>
    </div>

    <UCard class="max-w-2xl">
      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Nombre del evento" name="name" required>
          <UInput v-model="state.name" placeholder="Nombre del evento" />
        </UFormField>

        <UFormField label="Fecha del evento" name="dateEvent">
          <UInput v-model="state.dateEvent" type="date" />
        </UFormField>

        <UFormField label="Descripcion" name="description">
          <UTextarea v-model="state.description" placeholder="Descripcion del evento" :rows="4" />
        </UFormField>

        <UFormField label="Precio" name="price">
          <UInput v-model.number="state.price" type="number" placeholder="0 = Gratis" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton
            to="/admin/events"
            label="Cancelar"
            color="neutral"
            variant="ghost"
          />
          <UButton
            type="submit"
            label="Crear Evento"
            icon="i-lucide-check"
            :loading="loading"
          />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
