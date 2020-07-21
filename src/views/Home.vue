<template>
  <div class="home">
    <the-map-box />
    <the-info-side />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheMapBox from '@/components/TheMapBox.vue'
import TheInfoSide from '@/components/TheInfoSide.vue'

@Component<Home>({
  name: 'Home',
  components: {
    TheMapBox,
    TheInfoSide
  }
})
export default class Home extends Vue {}
</script>
