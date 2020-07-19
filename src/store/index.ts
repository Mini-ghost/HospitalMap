import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { config } from 'vuex-module-decorators'
import { initializeStores, modules } from '@/store/accessor'

Vue.use(Vuex)
config.rawError = true

const initializer = (store: Store<unknown>) => initializeStores(store)

export const plugins = [initializer]
export * from '@/store/accessor'

export default new Store({
  plugins,
  modules
})
