<template>
  <q-card flat bordered class="cursor-pointer full-height" @click="emit('select', country.code)">
    <q-card-section>
      <div class="row items-center no-wrap">
        <img
          :src="flagUrl(country.code, 80)"
          :alt="`Bandera de ${country.name}`"
          style="width: 40px; height: 28px; object-fit: cover; border-radius: 4px"
        />
        <div class="text-subtitle1 text-weight-bold ellipsis q-ml-sm">{{ country.name }}</div>
      </div>

      <div class="row justify-between text-caption text-grey-7 q-mt-sm">
        <span>Capital: {{ country.capital }}</span>
        <span>{{ formatPopulation(country.population) }}</span>
      </div>

      <div class="q-mt-sm">
        <q-chip dense size="sm" color="blue-1" text-color="primary">
          {{ CONTINENT_LABELS[country.continent] ?? country.continent }}
        </q-chip>
        <q-chip
          v-if="country.currency"
          dense
          size="sm"
          clickable
          icon="payments"
          color="green-1"
          text-color="green-9"
          @click.stop="emit('currency', country.currency)"
        >
          {{ country.currency.code }}
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { flagUrl, formatPopulation } from '@/utils/formatters'
import { CONTINENT_LABELS } from '@/constants/continents'

defineProps({
  country: { type: Object, required: true },
})

const emit = defineEmits(['select', 'currency'])
</script>
