<script setup lang="ts">
import PageConfig from './PageTypeConfig.vue'
</script>


<script lang="ts">
import { defineComponent } from 'vue'
import { injectSdk } from '@/classes/Utils'
import { getStorageValue, setStorageValue, getCurrentUrl } from '@/classes/Utils';

export default defineComponent({
  emits: [
    'update:isIgnoreCsp', 
    'update:isEnableThirdPartyCookies',
    'update:isAutoInitSitemap',
    'update:isBlockEvergage',
    'update:isInjectEmailCapture'
  ],
  props: {
      sdkUrl: {
        type: String,
        required: true
      },
      isIgnoreCsp: {
        type: Boolean,
        required: true
      },
      isEnableThirdPartyCookies: {
        type: Boolean,
        required: true
      },
      isAutoInitSitemap: {
        type: Boolean,
        required: true
      },
      isBlockEvergage: {
        type: Boolean,
        required: true
      },
      isInjectEmailCapture: {
        type: Boolean,
        required: true
      }    
  },


  data() {
    return {}
  },

  mounted() {
  },

  methods: {
  }
})
</script>

<template>
  <div class="columns is-mobile">
    <div class="column">
      <h5>SDK Config for: { hostname }</h5>
    </div>
    <div class="column has-text-right">
      <button class="button is-primary is-small" @click="injectSdk(sdkUrl || '', '')">Inject SDK</button>
    </div>
  </div>

  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field has-addons">
        <p class="control is-flex-grow-1">
          <input class="input is-small" v-model="sdkUrl" placeholder="Data Cloud Web SDK URL" />
        </p>
      </div>
    </div>
  </div>

  <div class="buttons is-right">
    <div class="buttons has-addons is-small">
      <span class="is-size-7 mr-5">Disable CSP rules</span>
      <button :class="{ 'button is-small': true, 'is-selected is-success': isIgnoreCsp }"
        @click="$emit('update:isIgnoreCsp', true)">Yes</button>
      <button :class="{ 'button is-small': true, 'is-selected is-danger': !isIgnoreCsp }"
        @click="$emit('update:isIgnoreCsp', false)">No</button>
    </div>
  </div>

  <div class="buttons is-right">
    <div class="buttons has-addons is-small">
      <span class="is-size-7 mr-5">Enable Third Party Cookies</span>
      <button :class="{ 'button is-small': true, 'is-selected is-success': isEnableThirdPartyCookies }"
        @click="$emit('update:isEnableThirdPartyCookies', true)">Yes</button>
      <button :class="{ 'button is-small': true, 'is-selected is-danger': !isEnableThirdPartyCookies }"
        @click="$emit('update:isEnableThirdPartyCookies', true)">No</button>
    </div>
  </div>

  <div class="buttons is-right">
    <div class="buttons has-addons is-small">
      <span class="is-size-7 mr-5">Auto Initialize Configured Sitemap</span>
      <button :class="{ 'button is-small': true, 'is-selected is-success': isAutoInitSitemap }"
        @click="$emit('update:isAutoInitSitemap', true)">Yes</button>
      <button :class="{ 'button is-small': true, 'is-selected is-danger': !isAutoInitSitemap }"
        @click="$emit('update:isAutoInitSitemap', true)">No</button>
    </div>
  </div>

  <div class="buttons is-right">
    <div class="buttons has-addons is-small">
      <span class="is-size-7 mr-5">Block MCP (Evergage) Beacon</span>
      <button :class="{ 'button is-small': true, 'is-selected is-success': isBlockEvergage }"
        @click="$emit('update:isBlockEvergage', true)">Yes</button>
      <button :class="{ 'button is-small': true, 'is-selected is-danger': !isBlockEvergage }"
        @click="$emit('update:isBlockEvergage', true)">No</button>
    </div>
  </div>

  <div class="buttons is-right">
    <div class="buttons has-addons is-small">
      <span class="is-size-7 mr-5">Inject Email Capture</span>
      <button :class="{ 'button is-small': true, 'is-selected is-success': isInjectEmailCapture }"
        @click="$emit('update:isInjectEmailCapture', true)">Yes</button>
      <button :class="{ 'button is-small': true, 'is-selected is-danger': !isInjectEmailCapture }"
        @click="$emit('update:isInjectEmailCapture', true)">No</button>
    </div>
  </div>
</template>

<style scoped></style>
