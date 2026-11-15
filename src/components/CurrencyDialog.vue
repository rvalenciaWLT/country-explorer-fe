<template>
  <q-dialog v-model="open" @show="loadRate">
    <q-card style="width: 380px; max-width: 90vw">
      <q-card-section class="row items-center no-wrap">
        <q-avatar color="green-1" text-color="green-9" font-size="16px">
          {{ currency.symbol }}
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-subtitle1 text-weight-bold">{{ currency.name }}</div>
          <div class="text-caption text-grey-7">{{ currency.code }} · API: Currencies (rates)</div>
        </div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section>
        <q-spinner v-if="loading" color="primary" size="md" />
        <q-banner v-else-if="error" class="bg-red-1 text-negative" rounded dense>
          {{ error }}
        </q-banner>
        <div v-else-if="rate !== null" class="bg-grey-2 q-pa-sm rounded-borders">
          1 {{ currency.code }} = {{ rate.toFixed(2) }} USD
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model.number="amount"
          type="number"
          outlined
          dense
          :label="`Convertir monto en ${currency.code}`"
        />
        <q-btn
          class="full-width q-mt-md"
          color="primary"
          label="Convertir a USD"
          no-caps
          unelevated
          :loading="converting"
          :disable="!(amount > 0)"
          @click="convertAmount"
        />
        <div v-if="result" class="text-h6 text-center q-mt-md">{{ result }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getRateToUSD, convert } from '@/services/currencies.service'

const props = defineProps({
  currency: { type: Object, required: true },
})

const open = defineModel({ type: Boolean, default: false })

const rate = ref(null)
const loading = ref(false)
const converting = ref(false)
const error = ref(null)
const amount = ref(100)
const result = ref('')

// Se ejecuta cada vez que se abre el modal
async function loadRate() {
  rate.value = null
  result.value = ''
  error.value = null
  loading.value = true
  try {
    rate.value = await getRateToUSD(props.currency.code)
  } catch (err) {
    error.value = err.userMessage
  } finally {
    loading.value = false
  }
}

async function convertAmount() {
  converting.value = true
  error.value = null
  try {
    const usd = await convert(props.currency.code, 'USD', amount.value)
    result.value = `${amount.value} ${props.currency.code} = ${usd.toFixed(2)} USD`
  } catch (err) {
    error.value = err.userMessage
  } finally {
    converting.value = false
  }
}
</script>
