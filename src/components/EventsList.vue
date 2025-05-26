<script setup lang="ts">
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { getStorageValue, setStorageValue, getCurrentUrl } from '@/classes/Utils';

export default defineComponent({
  props: {},
  emits: ['close'],

  computed: {
    storageKey() {
      return this.hostname + "_events"
    }
  },

  data() {
    return {
      hostname: "",
      events: [] as Array<any>
    }
  },

  mounted() {
    getCurrentUrl()
      .then(url => {
        this.hostname = url?.hostname || 'demo.com'
        return this.update()
      })
  },

  methods: {
    async update(){
      const events = await getStorageValue(this.storageKey)

      if(events && Array.isArray(events)){
        this.events = events
      }
    }
  }
})
</script>

<template>
  <div class="columns is-mobile">
    <div class="column">
      <h5>Events for: {{ hostname }}</h5>
    </div>
    <div class="column has-text-right">
      <div class="buttons is-right">
        <button class="button is-primary is-small" @click="update">Update</button>
      </div>
    </div>
  </div>



  <div class="box">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th class="is-size-7">DateTime</th>
          <th class="is-size-7">InteractionName</th>
          <th class="is-size-7">EventType</th>
          <th class="is-size-7">DeviceId</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in events">
          <td class="is-size-7">{{ e.dateTime.replace('T', ' ') }}</td>
          <td class="is-size-7">{{ e.interactionName }}</td>
          <td class="is-size-7">{{ e.eventType }}</td>
          <td class="is-size-7">{{ e.deviceId }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped></style>
