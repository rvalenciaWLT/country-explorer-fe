<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-btn flat dense no-caps icon="chevron_left" label="Volver al listado" to="/" />


    <q-skeleton v-if="loading" height="400px" class="q-mt-md" />


    <q-banner v-else-if="error" class="bg-red-1 text-negative q-mt-md" rounded>
      {{ error }}
      <template #action>
        <q-btn flat color="negative" label="Reintentar" @click="load" />
      </template>
    </q-banner>


    <q-card v-else-if="country" flat bordered class="q-mt-md">
      <q-card-section>

        <div class="row items-center no-wrap">
          <img
            :src="flagUrl(country.code, 320)"
            :alt="`Bandera de ${country.name}`"
            style="width: 120px; height: 80px; object-fit: cover; border-radius: 8px"
          />
          <div class="q-ml-md">
            <div class="text-h5 text-weight-bold">{{ country.name }}</div>
            <q-chip dense size="sm" color="blue-1" text-color="primary">
              {{ CONTINENT_LABELS[country.continent] ?? country.continent }}
            </q-chip>
          </div>
        </div>


        <div class="bg-primary text-white rounded-borders q-pa-md q-mt-md row items-center">
          <q-icon name="place" size="md" />
          <div class="q-ml-md">
            <div class="text-caption text-uppercase">Capital</div>
            <div class="text-h6 text-weight-bold">{{ country.capital }}</div>
          </div>
        </div>


        <div class="row q-col-gutter-md q-mt-sm">
          <div v-for="item in details" :key="item.label" class="col-12 col-sm-6 col-md-4">
            <div
              class="bg-grey-2 rounded-borders q-pa-sm full-height"
              :class="{ 'cursor-pointer': item.onClick }"
              @click="item.onClick?.()"
            >
              <div class="text-caption text-grey-7">{{ item.label }}</div>
              <div class="text-weight-bold">{{ item.value }}</div>
            </div>
          </div>
        </div>


        <div class="q-mt-md">
          <div class="text-caption text-grey-7">Países fronterizos</div>
          <template v-if="country.borders.length">
            <q-chip v-for="b in country.borders" :key="b" dense>{{ b }}</q-chip>
          </template>
          <div v-else class="text-grey-7">No tiene países fronterizos</div>
        </div>
      </q-card-section>
    </q-card>

    <CurrencyDialog v-if="country?.currency" v-model="showDialog" :currency="country.currency" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getByCode } from '@/services/countries.service'
import { flagUrl, formatPopulation, formatArea, formatDrivingSide } from '@/utils/formatters'
import { CONTINENT_LABELS } from '@/constants/continents'
import CurrencyDialog from '@/components/CurrencyDialog.vue'

const route = useRoute()

const country = ref(null)
const loading = ref(false)
const error = ref(null)
const showDialog = ref(false)

async function load() {
  loading.value = true
  error.value = null
  try {
    country.value = await getByCode(route.params.code)
    if (!country.value) error.value = 'País no encontrado'
  } catch (err) {
    error.value = err.userMessage
  } finally {
    loading.value = false
  }
}

onMounted(load)


const details = computed(() => {
  const c = country.value
  return [
    { label: 'Población', value: formatPopulation(c.population) },
    { label: 'Área', value: formatArea(c.area) },
    {
      label: 'Moneda ›',
      value: c.currency ? `${c.currency.name} (${c.currency.code})` : '—',
      onClick: c.currency ? () => (showDialog.value = true) : null,
    },
    { label: 'Idiomas', value: c.languages.join(', ') || '—' },
    { label: 'Zona horaria', value: c.timezones.join(', ') || '—' },
    { label: 'Código telefónico', value: c.callingCode },
    { label: 'Dominio', value: c.tld },
    { label: 'Conducción', value: formatDrivingSide(c.drivingSide) },
  ]
})
</script>
