<template>
  <div class="home">
    <TheMapBox />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheMapBox from '@/components/TheMapBox.vue'

@Component<Home>({
  name: 'Home',
  components: {
    TheMapBox,
  }
})
export default class Home extends Vue {}
</script>
