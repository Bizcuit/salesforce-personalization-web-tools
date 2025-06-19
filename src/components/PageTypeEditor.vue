<script setup lang="ts">
import { ref } from 'vue'
import { PageMatch, PageType } from '@/classes/SitemapConfig'
import BooleanToggle from './BooleanToggle.vue'

const emit = defineEmits(['close'])
const props = defineProps(['urlpath'])

const config = defineModel<PageType>()
const currentPagePath = ref(props.urlpath || '/')
const defaultEventTypes = ['websiteEngagement', 'productEngagement']
const eventTypeSelectorValue = ref(
  defaultEventTypes.includes(config.value!.eventType) ?
    config.value!.eventType :
    '-'
)

function changeEventTypeSelector() {
  if (eventTypeSelectorValue.value !== '-') {
    config.value!.eventType = eventTypeSelectorValue.value
  }
}

function addPageMatch() {
  const val = currentPagePath.value?.toLowerCase()?.trim() || ''

  if (val) {
    const i = config.value?.pages.findIndex(p => p.pagePath === val)

    if (i == undefined || i < 0) {
      config.value?.pages?.push(new PageMatch(currentPagePath.value, ''))
      currentPagePath.value = ''
    }
  }
}

function removePageMatch(pagePath: string) {
  const i = config.value?.pages.findIndex(p => p.pagePath === pagePath)

  if (i !== undefined && i >= 0) {
    config.value?.pages?.splice(i, 1)
  }
}


</script>


<template>

  <div class="buttons">
    <div class="buttons is-right">
      <button class="button is-small" @click="$emit('close')">back</button>
    </div>
  </div>

  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label class="label">Page Type</label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control">
          <input class="input is-small" :value="config!.pageTypeName" disabled />
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
          <select v-model="eventTypeSelectorValue" @change="changeEventTypeSelector">
            <option :value="et" v-for="et in defaultEventTypes">{{ et }}</option>
            <option value="-">custom</option>
          </select>
        </p>
        <p class="control is-flex-grow-1">
          <input class="input is-small" v-model="config!.eventType" :disabled="eventTypeSelectorValue !== '-'"
            placeholder="EG: websiteEngagement, productEngagement" />
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
          <input class="input is-small" v-model="config!.interactionName" placeholder="EG: View PDP, View PLP" />
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
          <input class="input is-small" v-model="currentPagePath" placeholder="/product/abc.html" />
        </p>
        <p class="control">
          <button class="button is-small" @click="addPageMatch()">
            <span>Add Current Page</span>
          </button>
        </p>
      </div>
    </div>
  </div>

  <div class="box is-flex is-flex-wrap-wrap">

    <div class="field has-addons mr-5 mb-2" v-for="p in config!.pages">
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




  <div class="columns is-mobile">
    <div class="column">
      <BooleanToggle label="Has Catalog" v-model="config!.hasCatalog"></BooleanToggle>
    </div>

    <div class="column">
      <input class="input is-small" v-model="config!.catalogType" placeholder="Item Type"
        :disabled="!config?.hasCatalog" />
    </div>
  </div>


  <div class="box" v-if="config?.hasCatalog">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th class="is-size-7" width="50%">Matching Page</th>
          <th class="is-size-7" width="50%">Catalog Object ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in config.pages">
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
