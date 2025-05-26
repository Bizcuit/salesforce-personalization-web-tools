<script setup lang="ts">
import SitemapConfig from './components/SitemapConfig.vue'
import SdkConfig from './components/SdkConfig.vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { launchWPM } from './classes/Utils';
import EventsList from './components/EventsList.vue';

export default defineComponent({
  data() {
    return {
      tab: 'sitemap'
    }
  },

})
</script>

<template>
  <div class="container">
    <div class="block">
      <div class="tabs is-right is-small">
        <ul>
          <li :class="{'is-active': tab == 'sitemap'}"><a @click="tab = 'sitemap'">Sitemap</a></li>
          <li :class="{'is-active': tab == 'sdk'}"><a @click="tab = 'sdk'">SDK</a></li>
          <li :class="{'is-active': tab == 'events'}"><a @click="tab = 'events'">Events</a></li>
          <li class=""><a @click="launchWPM()">WPM ⏵</a></li>
        </ul>
      </div>
    </div>

    <div class="block" v-if="tab == 'sitemap'">
      <SitemapConfig></SitemapConfig>
    </div>

    <div class="block" v-if="tab == 'sdk'">
      <SdkConfig></SdkConfig>
    </div>

    <div class="block" v-if="tab == 'events'">
      <EventsList></EventsList>
    </div>

  </div>
</template>

<style lang="css" scoped>
  .container {min-width: 500px !important; max-width: 555px !important;}
</style>