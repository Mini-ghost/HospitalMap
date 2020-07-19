import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import VetModule from '@/store/modules/VetModule'

export let vetModule: VetModule

export function initializeStores(store: Store<unknown>): void {
  vetModule = getModule(VetModule, store)
}

export const modules = {
  vetModule: VetModule
}
