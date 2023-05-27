<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list v-if="items.lenght" bordered separator>

      <q-item v-for="(item, index) in items" :key="index" clickable v-ripple>
        <q-item-section>{{ item.name }}</q-item-section>
      </q-item>

    </q-list>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SelectedFileList',
  props: {
    items: {
      required: true
    }
  }
})
</script>
