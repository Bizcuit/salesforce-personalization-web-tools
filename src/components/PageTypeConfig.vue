<script lang="ts">
import { type PageMatch } from '@/classes/Sitemap';
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['save', 'close'],
  props: {
    pathname: String,
    pageType: String,
    interactionName: String,
    eventType: String,
    catalogType: String,
    isCustomEventType: Boolean,
    hasCatalog: Boolean,
    pages: Array<PageMatch>
  },

  data() {
    return {
      currentPageType: {
        pageType: this.pageType,
        interactionName: this.interactionName,
        eventType: this.eventType,
        isCustomEventType: this.isCustomEventType,
        catalogType: this.catalogType,
        hasCatalog: this.hasCatalog,
        pages: this.pages as Array<PageMatch>
      },

      currentPage: this.pathname || ''
    }
  },

  watch: {
    pageType(newPageType, oldPageType) {
      this.copyPageTypeFromProps();
    },
    pathname(v) {
      this.currentPage = v as string
    }
  },



  mounted() {
    this.currentPage = this.pathname || 'demo'
    this.copyPageTypeFromProps()
  },

  created() {
    this.copyPageTypeFromProps()
  },

  methods: {
    saveAndClose() {
      this.$emit('save', this.currentPageType)
      this.$emit('close')
    },

    copyPageTypeFromProps() {
      this.currentPageType = JSON.parse(JSON.stringify(this.$props))
    },

    addPageMatch(pagePath: string) {
      pagePath = pagePath.trim().toLowerCase();

      if (!this.currentPageType.pages?.find(p => p.pagePath === pagePath)) {
        this.currentPageType.pages?.push({
          pagePath: pagePath,
          catalogId: pagePath.replace(/[\/\.]/gi, "-").replace(/^-*/gi, '').replace(/-*$/gi, '')
        })
      }
    },

    removePageMatch(pagePath: string) {
      const i = this.currentPageType.pages?.findIndex(p => p.pagePath === pagePath);

      if (i >= 0) {
        this.currentPageType.pages?.splice(i, 1);
      }
    },

    changeEventTypeSelect(value: string) {
      this.currentPageType.isCustomEventType = (value === '-');
      this.currentPageType.eventType = this.currentPageType.isCustomEventType ? "" : value;
    },
  }

})
</script>

<template>

  <div class="buttons">
    <div class="buttons is-right">
      <button class="button is-small" @click="$emit('close')">Close</button>
      <button class="button is-primary is-small" @click="saveAndClose">Save & Close</button>
    </div>
  </div>

  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label class="label">Page Type Name</label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control">
          <input class="input is-small" v-model="pageType" disabled
            placeholder="EG: pdp, plp, product_page, article_page, home_page" />
        </p>
      </div>
    </div>
  </div>


  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label class="label">Event Type</label>
    </div>
    <div class="field-body">
      <div class="field has-addons">
        <p class="control select is-small">
          <select @change="changeEventTypeSelect(($event?.target as HTMLInputElement)?.value || '')">
            <option value="websiteEngagement">Website Engagement</option>
            <option value="productEngagement">Product Engagement</option>
            <option value="-">Custom</option>
          </select>
        </p>
        <p class="control is-flex-grow-1">
          <input class="input is-small" v-model="currentPageType.eventType"
            :disabled="!currentPageType.isCustomEventType" placeholder="EG: websiteEngagement, productEngagement" />
        </p>
      </div>
    </div>
  </div>


  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label class="label">Interaction&nbsp;Name</label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control">
          <input class="input is-small" v-model="currentPageType.interactionName"
            placeholder="EG: View PDP, View PLP" />
        </p>
      </div>
    </div>
  </div>

  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label class="label">Matching&nbsp;Pages</label>
    </div>
    <div class="field-body">
      <div class="field has-addons">
        <p class="control is-flex-grow-1">
          <input class="input is-small" v-model="currentPage" placeholder="/product/abc.html" />
        </p>
        <p class="control">
          <button class="button is-small" @click="addPageMatch(currentPage)">
            <span>Add Current Page</span>
          </button>
        </p>
      </div>
    </div>
  </div>

  <div class="box is-flex is-flex-wrap-wrap">

    <div class="field has-addons mr-5 mb-2" v-for="p in currentPageType.pages">
      <p class="control">
        <button class="button is-small disabled" :title="p.pagePath">
          <span style="max-width: 250px; text-overflow: ellipsis; overflow: hidden;">{{ p.pagePath }}</span>
        </button>
      </p>
      <p class="control">
        <button class="button is-small is-danger" @click="removePageMatch(p.pagePath)">
          <span>✖</span>
        </button>
      </p>
    </div>

  </div>




  <div class="columns">
    <div class="column">
      <div class="buttons has-addons is-small">
        <button class="button is-small" disabled>Has Catalog Object</button>
        <button :class="{ 'button is-small': true, 'is-selected is-success': currentPageType.hasCatalog }"
          @click="currentPageType.hasCatalog = true">Yes</button>
        <button :class="{ 'button is-small': true, 'is-selected is-danger': !currentPageType.hasCatalog }"
          @click="currentPageType.hasCatalog = false">No</button>
      </div>
    </div>

    <div class="column" v-if="currentPageType.hasCatalog">
      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">CatalogObjectType</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input is-small" v-model="currentPageType.catalogType" placeholder="Product"
                :disabled="!currentPageType.hasCatalog" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="box" v-if="currentPageType.hasCatalog">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th class="is-size-7" width="50%">Matching Page</th>
          <th class="is-size-7" width="50%">Catalog Object ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in currentPageType.pages">
          <td class="is-size-7">{{ p.pagePath }}</td>
          <td>
            <input class="input is-small" v-model="p.catalogId" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>




</template>

<style scoped>
select {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>
