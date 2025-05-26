<script setup lang="ts">
import PageConfig from './PageTypeConfig.vue'
</script>


<script lang="ts">
import { defineComponent } from 'vue'
import { type PageMatch } from '@/classes/Sitemap'
import { type PageType } from '@/classes/Sitemap'
import { generateSitemap } from '@/classes/Sitemap'
import { getCurrentUrl } from '@/classes/Utils'
import { downloadTextFile } from '@/classes/Utils'
import { setStorageValue } from '@/classes/Utils'
import { getStorageValue } from '@/classes/Utils'

export default defineComponent({
  props: {},

  data() {
    return {
      newPageTypeName: 'home_page',
      hostname: 'demo.com',
      pathname: 'demo',
      isEditingPageType: false,
      currentPageTypeName: '',
      currentPageType: this.newPageType(),
      currentSitemap: '',
      pageConfigs: [] as Array<PageType>
    }
  },

  computed: {
    storageKey() {
      return this.hostname + '_pageConfigs'
    }
  },

  mounted() {
    getCurrentUrl()
      .then(url => {
        this.hostname = url?.hostname || 'demo.com'
        this.pathname = url?.pathname || 'demo'
      })
      .then(_ => {
        return this.loadSdkConfig()
      })
  },

  methods: {
    downloadSitemap() {
      this.currentSitemap = generateSitemap(this.pageConfigs)
      downloadTextFile(`sitemap.${this.hostname}.txt`, this.currentSitemap)
      console.log(this.currentSitemap)
    },

    addPageType(pageType: string) {
      if (!pageType) return

      pageType = pageType.trim()

      if (!this.pageConfigs?.find(p => p.pageType === pageType)) {
        this.pageConfigs?.push(this.newPageType(pageType))
        this.editPageType(pageType)
        this.newPageTypeName = ''
      }
    },

    removePageType(pageType: string) {
      if (!confirm(`Are you sure you want to delete PageType "${pageType}"?`)) return

      const i = this.pageConfigs?.findIndex(p => p.pageType === pageType)

      if (i >= 0) {
        this.pageConfigs?.splice(i, 1)
      }

      this.saveSdkConfig()
    },

    editPageType(pageType: string) {
      console.log(this.pageConfigs, typeof this.pageConfigs)
      this.isEditingPageType = true
      this.currentPageTypeName = pageType
      this.currentPageType = this.pageConfigs?.find(p => p.pageType === pageType)
    },

    saveSdkConfig() {
      setStorageValue(
        this.storageKey,
        {
          pageConfigs: JSON.stringify(this.pageConfigs),
          sitemap: generateSitemap(this.pageConfigs)
        }
      )
    },

    async loadSdkConfig() {
      const config = await getStorageValue(this.storageKey)
      
      if (config?.pageConfigs) {
        this.pageConfigs.push(...JSON.parse(config.pageConfigs))
      }

      if(config?.sitemap){
        this.currentSitemap = config?.sitemap
      }
    },

    newPageType(pageType: string) {
      return {
        pageType: pageType,
        interactionName: pageType + ' view',
        eventType: 'websiteEngagement',
        catalogType: '',
        isCustomEventType: false,
        hasCatalog: false,
        pages: ([] as PageMatch[])
      } as PageType
    },

    savePageType(pageTypeConfig: PageType) {
      if (pageTypeConfig) {
        const t = this.pageConfigs?.find(pc => pc.pageType === pageTypeConfig.pageType)
        if(t){
          Object.assign(t, pageTypeConfig)
        }
      }
      
      this.saveSdkConfig()
    },

    closePageTypeConfig(){
      this.isEditingPageType = false
    }
  }
})
</script>

<template>
  <div class="columns is-mobile">
    <div class="column">
      <h5>Sitemap for: {{ hostname }}</h5>
    </div>
    <div class="column has-text-right">
      <button class="button is-primary is-small" @click="downloadSitemap">Download Sitemap</button>
    </div>
  </div>


  <div class="block" v-if="!isEditingPageType">
    <div class="field has-addons">
      <p class="control is-flex-grow-1">
        <input class="input is-small" v-model="newPageTypeName"
          placeholder="EG: pdp, plp, product_page, article_page, home_page" />
      </p>
      <p class="control">
        <button class="button is-small" @click="addPageType(newPageTypeName)">
          <span>Add PageType</span>
        </button>
      </p>
    </div>
  </div>

  <div class="box" v-if="!isEditingPageType">
    <div class="block has-text-centered is-size-7" v-if="!pageConfigs?.length">
      NO PAGETYPES DEFINED
    </div>

    <p v-for="p in pageConfigs">
    <div class="field has-addons mr-5 mb-2">
      <p class="control is-flex-grow-1">
        <button @click="editPageType(p.pageType)"
          class="button is-small is-flex-grow-1 is-fullwidth is-justify-content-flex-start">
          <span>{{ p.pageType }} ( {{ p.pages.length }} webpage/s )</span>
        </button>
      </p>
      <p class="control">
        <button class="button is-small is-danger" @click="removePageType(p.pageType)">
          <span>✖</span>
        </button>
      </p>
    </div>
    </p>

  </div>

  <PageConfig v-if="isEditingPageType" v-bind="currentPageType" v-bind:pathname="pathname" @save="savePageType" @close="closePageTypeConfig">
  </PageConfig>

</template>

<style scoped>
select {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>
