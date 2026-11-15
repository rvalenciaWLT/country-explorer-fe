import { countriesApi } from '@/boot/axios'
import { mapCountry } from '@/utils/country.mapper'

const LIMIT = 100 // máximo permitido plan Free

const toList = (res) => res.data.data.objects.map(mapCountry)

async function fetchAllPages(url, params = {}) {
  const countries = []
  let offset = 0
  let more = true
  while (more) {
    const res = await countriesApi.get(url, { params: { ...params, limit: LIMIT, offset } })
    countries.push(...toList(res))
    more = res.data.data.meta.more
    offset += LIMIT
  }
  return countries
}

export const getAll = () => fetchAllPages('')

export const searchByCapital = (q) => fetchAllPages('/capitals', { q })

export const getByRegion = (region) => fetchAllPages(`/region/${region}`)

export const getByCode = (code) =>
  countriesApi.get(`/codes.alpha_2/${code}`).then((res) => toList(res)[0] ?? null)
