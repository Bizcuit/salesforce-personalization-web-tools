<script setup lang="ts">
  import BooleanToggle from './BooleanToggle.vue'
  import SdkConfig from '@/classes/SdkConfig'
  const config = defineModel<SdkConfig>()
</script>


<template>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field has-addons">
        <p class="control is-flex-grow-1">
          <input class="input is-small" v-model="config!.sdkUrl"
            placeholder="Data Cloud Web SDK URL" />
        </p>
      </div>
    </div>
  </div>

  <BooleanToggle label="Disable CSP rules" v-model="config!.isIgnoreCsp"></BooleanToggle>
  
  <BooleanToggle label="Enable Third Party Cookies" v-model="config!.isEnableThirdPartyCookies"></BooleanToggle>
  
  <BooleanToggle label="Auto Initialize Configured Sitemap" v-model="config!.isAutoInitSitemap"></BooleanToggle>
  
  <BooleanToggle label="Block MCP (Evergage) Beacon" v-model="config!.isBlockEvergage"></BooleanToggle>
  
  <BooleanToggle label="Inject Email Capture" v-model="config!.isInjectEmailCapture"></BooleanToggle>

</template>

<style scoped></style>
