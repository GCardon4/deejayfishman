<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const supabase = useSupabase()
const toast = useToast()
const loading = ref(false)

const eventId = route.params.id as string

// Estado del formulario de edicion
const state = reactive({
  name: '',
  dateEvent: '',
  description: '',
  price: null as number | null
})

// Cargar datos del evento a editar
const { pending } = useAsyncData(`adminEvent-${eventId}`, async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error) throw error

  state.name = data.name || ''
  state.dateEvent = data.date_event || ''
  state.description = data.description || ''
  state.price = data.price

  return data
})

// Actualizar evento en la base de datos
async function onSubmit() {
  loading.value = true
  try {
    const { error } = await supabase
      .from('events')
      .update({
        name: state.name,
        date_event: state.dateEvent || null,
        description: state.description,
        price: state.price
      })
      .eq('id', eventId)

    if (error) throw error

    toast.add({ title: 'Actualizado', description: 'Evento actualizado correctamente', color: 'success' })
    navigateTo('/admin/events')
  } catch (e: any) {
    toast.add({ title: 'Error', description: e.message || 'No se pudo actualizar el evento', color: 'error' })
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
        Editar Evento
      </h1>
    </div>

    <div v-if="pending" class="max-w-2xl space-y-4">
      <USkeleton class="h-10 rounded-lg" />
      <USkeleton class="h-10 rounded-lg" />
      <USkeleton class="h-24 rounded-lg" />
      <USkeleton class="h-10 rounded-lg" />
    </div>

    <UCard v-else class="max-w-2xl">
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
            label="Guardar Cambios"
            icon="i-lucide-check"
            :loading="loading"
          />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
