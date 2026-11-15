<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-8 col-md-9">
      <q-input
        v-model="search"
        outlined
        dense
        debounce="500"
        label="Buscar"
        placeholder="Buscar por capital..."
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="col-12 col-sm-4 col-md-3">
      <q-select
        v-model="continent"
        :options="CONTINENTS"
        emit-value
        map-options
        outlined
        dense
        label="Continente"
      />
    </div>
  </div>
</template>

<script setup>
import { CONTINENTS } from '@/constants/continents'

const search = defineModel('search', { type: String, default: '' })
const continent = defineModel('continent', { default: null })
</script>
