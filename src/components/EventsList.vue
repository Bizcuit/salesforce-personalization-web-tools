<script setup lang="ts">
import type DataCloudEvent from '@/classes/DataCloudEvent';
import { ref } from 'vue'
const events = defineModel<Array<DataCloudEvent>>()

function showEvent(e: DataCloudEvent){
  alert(e.formattedJson)
}
</script>

<template>
  <div class="box">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th class="is-size-7">DateTime</th>
          <th class="is-size-7">DeviceId</th>
          <th class="is-size-7">EventType</th>
          <th class="is-size-7">InteractionName</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in events">
          <td class="is-size-7"><a @click="showEvent(e)">{{ e.dateTime }}</a></td>
          <td class="is-size-7">{{ e.deviceId }}</td>
          <td class="is-size-7">{{ e.eventType }}</td>
          <td class="is-size-7">{{ e.interactionName }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped></style>
