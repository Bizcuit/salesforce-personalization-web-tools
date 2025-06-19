<script setup lang="ts">
import SitemapConfigEditor from './components/SitemapConfigEditor.vue'
import SdkConfigEditor from './components/SdkConfigEditor.vue'
import EventsList from './components/EventsList.vue'

import HostConfig from './classes/HostConfig'
import { getCurrentUrl, launchWPM, downloadTextFile } from './classes/Utils';
import { ref, watch, onMounted } from 'vue'

const hostConfig = ref<HostConfig | null>(null);
const tab = ref('sitemap')
const hostname = ref('')
const urlpath = ref('')

async function getConfig() {
  const url = await getCurrentUrl()
  urlpath.value = url?.pathname || '/'
  hostname.value = url?.hostname || 'salesforce.demo'

  return await HostConfig.getConfig(hostname.value)
}

onMounted(async () => {
  hostConfig.value = await getConfig()
})

watch(hostConfig, (newVal, oldVal) => {
  if(oldVal && newVal){
    console.log("hostConfig updated")
    hostConfig.value?.saveConfig()
  }
}, {deep: true})

function downloadSitemap() {
  const sitemap = hostConfig.value?.sitemapConfig?.sitemap

  if (sitemap) {
    downloadTextFile(`sitemap_${hostname.value}.txt`, sitemap)
  }
}

</script>

<template>


  <div class="container">
    <div class="columns is-mobile">
      <div class="column">
        <h5>Website: {{ hostname }}</h5>
      </div>
      <div class="column has-text-right">
        <button class="button is-small" @click="downloadSitemap()">Download Sitemap</button>
      </div>
    </div>

    <div class="block">
      <div class="tabs is-right is-small">
        <ul>
          <li :class="{ 'is-active': tab == 'sitemap' }"><a @click="tab = 'sitemap'">Sitemap</a></li>
          <li :class="{ 'is-active': tab == 'sdk' }"><a @click="tab = 'sdk'">SDK</a></li>
          <li :class="{ 'is-active': tab == 'events' }"><a @click="tab = 'events'">Events</a></li>
          <li class=""><a @click="launchWPM()">WPM ⏵</a></li>
        </ul>
      </div>
    </div>

    <div class="block" v-if="tab == 'sitemap' && hostConfig?.sitemapConfig">
      <SitemapConfigEditor v-model="hostConfig.sitemapConfig" :urlpath="urlpath"></SitemapConfigEditor>
    </div>

    <div class="block" v-if="tab == 'sdk' && hostConfig?.sdkConfig">
      <SdkConfigEditor v-model="hostConfig.sdkConfig"></SdkConfigEditor>
    </div>

    <div class="block" v-if="tab == 'events' && hostConfig?.events">
      <EventsList v-model="hostConfig.events"></EventsList>
    </div>

  </div>
</template>

<style lang="css" scoped>
.container {
  min-width: 500px !important;
  max-width: 555px !important;
}
</style>