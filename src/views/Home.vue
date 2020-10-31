<template>
  <div class="home">
    <the-map-box />
    <the-search @click-more="onToggleFilter" />
    <the-info-side />
    <the-filter-box v-model="isFilering" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheMapBox from '@/components/TheMapBox.vue'
import TheInfoSide from '@/components/TheInfoSide.vue'
import TheSearch from '@/components/TheSearch.vue'
import TheFilterBox from '@/components/TheFilterBox.vue'

@Component<Home>({
  name: 'Home',
  components: {
    TheMapBox,
    TheInfoSide,
    TheSearch,
    TheFilterBox  
  }
})
export default class Home extends Vue {
  isFilering = true

  onToggleFilter () {
    this.isFilering = !this.isFilering 
  }
}
</script>
