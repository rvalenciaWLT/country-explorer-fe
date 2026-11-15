import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as countriesService from '@/services/countries.service'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref([])
  const loading = ref(false)
  const error = ref(null)

  const cache = new Map()

  async function loadCountries(search = '', continent = null) {
    const q = search.trim().toLowerCase()
    const key = q ? `capital:${q}` : continent ? `region:${continent}` : 'all'

    loading.value = true
    error.value = null

    try {
      if (!cache.has(key)) {
        const request = q
          ? countriesService.searchByCapital(q)
          : continent
            ? countriesService.getByRegion(continent)
            : countriesService.getAll()
        cache.set(key, await request)
      }

      let list = cache.get(key)

      if (q && continent) list = list.filter((c) => c.region.toLowerCase() === continent)
      countries.value = list
    } catch (err) {
      countries.value = []

      if (err.response?.status !== 404) error.value = err.userMessage
    } finally {
      loading.value = false
    }
  }

  return { countries, loading, error, loadCountries }
})
