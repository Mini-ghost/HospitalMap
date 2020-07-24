<template>
  <div class="home">
    <the-map-box />
    <the-search />
    <the-info-side />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheMapBox from '@/components/TheMapBox.vue'
import TheInfoSide from '@/components/TheInfoSide.vue'
import TheSearch from '@/components/TheSearch.vue'

@Component<Home>({
  name: 'Home',
  components: {
    TheMapBox,
    TheInfoSide,
    TheSearch
  }
})
export default class Home extends Vue {}
</script>
