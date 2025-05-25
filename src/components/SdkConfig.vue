<script setup lang="ts">
import PageConfig from './PageTypeConfig.vue'
</script>


<script lang="ts">
import { defineComponent } from 'vue'
import { injectSdk } from '@/classes/Utils'
import { getStorageValue, setStorageValue, getCurrentUrl } from '@/classes/Utils';

export default defineComponent({
  props: {},

  computed: {
    storageKey() {
      return this.hostname + "_sdk"
    }
  },

  data() {
    return {
      hostname: "",
      sdkUrl: "",
      isIgnoreCsp: true
    }
  },

  mounted() {
    getCurrentUrl()
      .then(url => {
        this.hostname = url?.hostname || 'demo.com'
        return getStorageValue(this.storageKey)
      })
      .then((value: any) => {
        this.sdkUrl = value?.sdkUrl || ''
        this.isIgnoreCsp = value?.isIgnoreCsp === false ? false : true
      })
  },

  methods: {
    saveSdkConfig() {
      setStorageValue(this.storageKey, {
        sdkUrl: this.sdkUrl,
        isIgnoreCsp: this.isIgnoreCsp
      })

      injectSdk(this.sdkUrl)
    }
  }
})
</script>

<template>
  <div class="columns is-mobile">
    <div class="column">
      <h5>SDK Config for: {{ hostname }}</h5>
    </div>
    <div class="column has-text-right">
      <button class="button is-primary is-small" @click="saveSdkConfig">Save & Inject SDK</button>
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
        <button class="button is-small" disabled>Disable CSP rules</button>
        <button :class="{ 'button is-small': true, 'is-selected is-success': isIgnoreCsp }"
          @click="isIgnoreCsp = true">Yes</button>
        <button :class="{ 'button is-small': true, 'is-selected is-danger': !isIgnoreCsp }"
          @click="isIgnoreCsp = false">No</button>
      </div>
</div>
</template>

<style scoped></style>
