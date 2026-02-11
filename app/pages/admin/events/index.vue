<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabase()
const toast = useToast()

// Estado para el modal de confirmacion
const deleteModal = ref(false)
const eventToDelete = ref<any>(null)

// Obtener listado de eventos
const { data: events, refresh } = useAsyncData('adminEvents', async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date_event', { ascending: false })

  if (error) throw error
  return data
})

// Columnas de la tabla
const columns = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'date_event', header: 'Fecha' },
  { accessorKey: 'price', header: 'Precio' },
  { accessorKey: 'actions', header: 'Acciones' }
]

// Formatear fecha para mostrar en la tabla
function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Formatear precio para mostrar en la tabla
function formatPrice(price: number | null) {
  if (!price) return 'Gratis'
  return `$${price.toLocaleString('es-AR')}`
}

// Confirmar eliminacion de evento
function confirmDelete(event: any) {
  eventToDelete.value = event
  deleteModal.value = true
}

// Eliminar evento de la base de datos
async function deleteEvent() {
  if (!eventToDelete.value) return

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventToDelete.value.id)

  if (error) {
    toast.add({ title: 'Error', description: 'No se pudo eliminar el evento', color: 'error' })
    return
  }

  toast.add({ title: 'Eliminado', description: 'Evento eliminado correctamente', color: 'success' })
  deleteModal.value = false
  eventToDelete.value = null
  refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">
        Eventos
      </h1>
      <UButton
        to="/admin/events/create"
        label="Nuevo Evento"
        icon="i-lucide-plus"
      />
    </div>

    <UCard>
      <UTable :data="events || []" :columns="columns">
        <template #date_event-cell="{ row }">
          {{ formatDate(row.original.date_event) }}
        </template>

        <template #price-cell="{ row }">
          {{ formatPrice(row.original.price) }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1">
            <UButton
              :to="`/admin/events/${row.original.id}`"
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="confirmDelete(row.original)"
            />
          </div>
        </template>
      </UTable>

      <div v-if="!events?.length" class="text-center py-8 text-neutral-500">
        No hay eventos creados aun.
      </div>
    </UCard>

    <!-- Modal de confirmacion de eliminacion -->
    <UModal v-model:open="deleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">
            Eliminar Evento
          </h3>
          <p class="text-neutral-400 mb-6">
            Estas seguro de eliminar <strong>{{ eventToDelete?.name }}</strong>? Esta accion no se puede deshacer.
          </p>
          <div class="flex justify-end gap-3">
            <UButton
              label="Cancelar"
              color="neutral"
              variant="ghost"
              @click="deleteModal = false"
            />
            <UButton
              label="Eliminar"
              color="error"
              icon="i-lucide-trash-2"
              @click="deleteEvent"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
