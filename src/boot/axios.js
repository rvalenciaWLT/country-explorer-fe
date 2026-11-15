import { defineBoot } from '#q-app'
import axios from 'axios'

const API_URL = 'https://api.restcountries.com'
const apiKey = import.meta.env.QCLI_RESTCOUNTRIES_API_KEY

function createApi(path) {
  const api = axios.create({
    baseURL: `${API_URL}${path}`,
    timeout: 10000,
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status
      const messages = {
        401: 'API key inválida',
        403: 'Origen no permitido para esta API key (revisa los CORS en el dashboard)',
        404: 'No se encontraron resultados',
      }
      error.userMessage = error.response
        ? messages[status] || `Error del servidor (${status})`
        : 'No se pudo conectar con el servidor. Revisa tu conexión'
      return Promise.reject(error)
    },
  )

  return api
}

const countriesApi = createApi('/countries/v5')
const currenciesApi = createApi('/currencies/v1')

export default defineBoot(({ app }) => {
  app.config.globalProperties.$countriesApi = countriesApi
  app.config.globalProperties.$currenciesApi = currenciesApi
})

export { countriesApi, currenciesApi }
