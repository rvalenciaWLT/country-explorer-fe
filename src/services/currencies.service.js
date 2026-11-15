import { currenciesApi } from '@/boot/axios'

const first = (res) => res.data.data.objects[0]


export const getRateToUSD = (code) =>
  currenciesApi.get(`/rates/${code}`).then((res) => first(res).rates.USD)

export const convert = (from, to, amount) =>
  currenciesApi.get('/convert', { params: { from, to, amount } }).then((res) => first(res).result)
