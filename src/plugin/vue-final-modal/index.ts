import Vue from 'vue'
import VueFinalModal, { VfmOptions } from 'vue-final-modal'

Vue.use<VfmOptions>(VueFinalModal(), {
  componentName: 'VueFinalModal',
  key: 'vfm'
})