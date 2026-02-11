<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabase()
const toast = useToast()

// Estado para el modal de confirmacion
const deleteModal = ref(false)
const newsToDelete = ref<any>(null)

// Obtener listado de noticias
const { data: news, refresh } = useAsyncData('adminNews', async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Columnas de la tabla
const columns = [
  { accessorKey: 'name', header: 'Titulo' },
  { accessorKey: 'created_at', header: 'Fecha' },
  { accessorKey: 'actions', header: 'Acciones' }
]

// Formatear fecha para mostrar en la tabla
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Confirmar eliminacion de noticia
function confirmDelete(item: any) {
  newsToDelete.value = item
  deleteModal.value = true
}

// Eliminar noticia de la base de datos
async function deleteNews() {
  if (!newsToDelete.value) return

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', newsToDelete.value.id)

  if (error) {
    toast.add({ title: 'Error', description: 'No se pudo eliminar la noticia', color: 'error' })
    return
  }

  toast.add({ title: 'Eliminada', description: 'Noticia eliminada correctamente', color: 'success' })
  deleteModal.value = false
  newsToDelete.value = null
  refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">
        Noticias
      </h1>
      <UButton
        to="/admin/news/create"
        label="Nueva Noticia"
        icon="i-lucide-plus"
      />
    </div>

    <UCard>
      <UTable :data="news || []" :columns="columns">
        <template #created_at-cell="{ row }">
          {{ formatDate(row.original.created_at) }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1">
            <UButton
              :to="`/admin/news/${row.original.id}`"
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

      <div v-if="!news?.length" class="text-center py-8 text-neutral-500">
        No hay noticias creadas aun.
      </div>
    </UCard>

    <!-- Modal de confirmacion de eliminacion -->
    <UModal v-model:open="deleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">
            Eliminar Noticia
          </h3>
          <p class="text-neutral-400 mb-6">
            Estas seguro de eliminar <strong>{{ newsToDelete?.name }}</strong>? Esta accion no se puede deshacer.
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
              @click="deleteNews"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
