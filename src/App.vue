<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component<App>({
  name: 'App'
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

#app {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    'Microsoft JhengHei',
    'PingFangTC',
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.__fade-enter-active,
.__fade-leave-active {
  transition: opacity .5s .3s;
}
.__fade-enter,
.__fade-leave-to {
  opacity: 0;
}
</style>
