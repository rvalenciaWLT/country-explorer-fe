<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="text-h5 text-weight-bold">Country Explorer - v1</div>
    <div class="text-caption text-grey-7">
      Busca por capital, filtra por continente, toca una tarjeta para ver el detalle o toca la
      moneda para ver su tasa
    </div>

    <CountryFilters v-model:search="search" v-model:continent="continent" class="q-mt-md" />

    <div v-if="store.loading" class="row q-col-gutter-md q-mt-sm">
      <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-skeleton height="110px" />
      </div>
    </div>

    <q-banner v-else-if="store.error" class="bg-red-1 text-negative q-mt-md" rounded>
      {{ store.error }}
      <template #action>
        <q-btn flat color="negative" label="Reintentar" @click="load" />
      </template>
    </q-banner>

    <div v-else-if="!store.countries.length" class="text-center text-grey-7 q-mt-xl">
      No se encontraron países
    </div>

    <div v-else class="row q-col-gutter-md q-mt-sm">
      <div v-for="c in store.countries" :key="c.code" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <CountryCard :country="c" @select="goToDetail" @currency="openCurrency" />
      </div>
    </div>

    <CurrencyDialog v-if="selectedCurrency" v-model="showDialog" :currency="selectedCurrency" />
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries-store'
import CountryFilters from '@/components/CountryFilters.vue'
import CountryCard from '@/components/CountryCard.vue'
import CurrencyDialog from '@/components/CurrencyDialog.vue'

const store = useCountriesStore()
const router = useRouter()

const search = ref('')
const continent = ref(null)
const selectedCurrency = ref(null)
const showDialog = ref(false)

const load = () => store.loadCountries(search.value, continent.value)

onMounted(load)
watch([search, continent], load)

const goToDetail = (code) => router.push(`/country/${code}`)

function openCurrency(currency) {
  selectedCurrency.value = currency
  showDialog.value = true
}
</script>
