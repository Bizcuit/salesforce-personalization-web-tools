<script setup lang="ts">
import { ref } from 'vue'
import PageTypeEditor from './PageTypeEditor.vue'

import { SitemapConfig, PageType } from '@/classes/SitemapConfig'

const config = defineModel<SitemapConfig>()
const props = defineProps(['urlpath'])

const newPageTypeName = ref('')
const currentPageType = ref<PageType | null>(null)

function addPageType() {
  if(!newPageTypeName?.value) return

  const i = config.value?.pageTypes?.findIndex(p => p.pageTypeName === newPageTypeName.value)

  if (i === undefined || i < 0) {
    config.value?.pageTypes.push(new PageType(newPageTypeName.value))
  }

  newPageTypeName.value = ''
}

function removePageType(pageTypeName: string) {
  const i = config.value?.pageTypes?.findIndex(p => p.pageTypeName === pageTypeName)

  if (i !== undefined && i >= 0) {
    config.value?.pageTypes.splice(i, 1)
  }
}

function editPageType(pageTypeName: string) {
  currentPageType.value = null

  const pt = config.value?.pageTypes?.find(p => p.pageTypeName === pageTypeName)

  if (pt) {
    currentPageType.value = pt
  }
}
</script>

<template>
  <div class="block" v-if="!currentPageType">
    <div class="field has-addons">
      <p class="control is-flex-grow-1">
        <input class="input is-small" v-model="newPageTypeName"
          placeholder="EG: pdp, plp, product_page, article_page, home_page" />
      </p>
      <p class="control">
        <button class="button is-small" @click="addPageType">
          <span>Add PageType</span>
        </button>
      </p>
    </div>
  </div>

  <div class="box" v-if="!currentPageType">
    <div class="block has-text-centered is-size-7" v-if="!config?.pageTypes?.length">
      NO PAGETYPES DEFINED
    </div>

    <div v-for="p in config?.pageTypes" class="mb-3">
      <div class="field has-addons mr-5 mb-2">
        <p class="control is-flex-grow-1">
          <button @click="editPageType(p.pageTypeName)"
            :class="[
              p?.pages?.find(p => p?.pagePath === props?.urlpath) ? 'is-link is-outlined' : '', 
              'button is-small is-flex-grow-1 is-fullwidth is-justify-content-flex-start'
            ]">
            <span>{{ p.pageTypeName }} ( {{ p.pages.length }} webpage/s )</span>
          </button>
        </p>
        <p class="control">
          <button class="button is-small is-danger" @click="removePageType(p.pageTypeName)">
            <span>✖</span>
          </button>
        </p>
      </div>
    </div>

  </div>

  <PageTypeEditor v-if="currentPageType" v-model="currentPageType" :urlpath="urlpath" @close="currentPageType = null">
  </PageTypeEditor>

</template>

<style scoped>
select {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>
