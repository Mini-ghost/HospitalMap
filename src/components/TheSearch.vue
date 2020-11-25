<template>
  <div class="fixed top-4 left-4 right-4 flex justify-between md:max-w-md z-50">
    <input
      v-model.trim="searchText"
      class="rounded-xl px-3 py-2 flex-1 bg-gray-100 focus:bg-white placeholder-gray-500 shadow-md duration-100 ease-in-out focus:outline-none border-2 border-transparent focus:border-gray-500"
      placeholder="請輸入動物醫院名稱"
      type="text"
      autocomplete="off"
      spellcheck="false"
      @keydown.enter="onSearch"
    >
    <button
      class="rounded-xl px-3 py-2 bg-gray-100 flex-none ml-2 shadow-md focus:outline-none border-2 border-transparent focus:bg-white focus:border-gray-500 transition duration-100 transform active:scale-95"
      type="submit"
      @click="onSearch"
    >
      Search
    </button>
    <button
      aria-label="進階搜尋"
      class="advanced-tooltip relative rounded-xl px-1 py-2 bg-gray-100 flex-none ml-2 shadow-md focus:outline-none border-2 border-transparent focus:bg-white focus:border-gray-500 transition duration-100 transform active:scale-95"
      type="button"
    >
      ▸
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import VetModuleClass from '@/store/modules/VetModule'
import { vetModule } from '@/store'

@Component<TheSearch>({
  name: 'TheSearch'
})
export default class TheSearch extends Vue {
  searchText = ''

  onSearch() {
    const filter: Partial<VetModuleClass['vetFilter']> = {
      search: this.searchText
    }
    vetModule.SET_SEARCH(filter)
  }
}
</script>

<style lang="scss">
.advanced-tooltip {
  @media (min-width: 768px) {
    // variable
    $space: 10px;
    --color-text: #efefef;
    --color-background: #232323;

    &:hover:after {
      content: attr(aria-label);
      position: absolute;
      top: calc(100% + #{$space});
      left: 0px;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 6px 10px;
      color: var(--color-text);
      background-color: var(--color-background);
      text-align: center;
      word-wrap: break-word;
      white-space: pre;
      border-radius: .5rem;
      z-index: 999;
    }
  }
}
</style>
