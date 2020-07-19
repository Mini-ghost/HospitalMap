<template>
  <div class="home">
    <TheMapBox />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheMapBox from '@/components/TheMapBox.vue'
import { vetModule } from '@/store'

@Component<Home>({
  name: 'Home',
  components: {
    TheMapBox,
  },
  mounted () {
    vetModule.GET_VET_DATA()
  }
})
export default class Home extends Vue {}
</script>
