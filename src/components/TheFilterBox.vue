<template>
  <vue-final-modal
    :value="visibility"
    classes="filter-blur-1"
    content-class="w-11/12 max-w-2xl rounded-xl bg-gray-100 p-5 mx-auto my-40 shadow-md"
    name="filter"
    @input="(type) => $emit('input', type)"
  >
    <h3 class="text-2xl font-bold">
      進階搜尋
    </h3>
    <div class="mt-4">
      <form @submit.prevent>
        <!-- 一般輸入框 -->
        <form-item label="動物醫院名稱">
          <input
            v-model.trim="filterForm.name"
            class="rounded-xl px-3 py-2 flex-1 bg-gray-300 focus:bg-white placeholder-gray-500 duration-100 ease-in-out focus:outline-none border-2 border-transparent focus:border-gray-500"
            placeholder="請輸入動物醫院名稱"
            type="text"
            autocomplete="off"
            spellcheck="false"
          >
        </form-item>
        <!-- 區域下拉選單 -->
        <form-item label="區域">
          <select
            v-model="filterForm.district"
            name="city"
            class="rounded-xl px-3 py-2 flex-1 bg-gray-300 focus:bg-white placeholder-gray-500 duration-100 ease-in-out focus:outline-none border-2 border-transparent focus:border-gray-500"
          >
            <option
              v-for="{ name, id } in districts"
              :key="id"
              :value="id"
            >
              {{ name }}
            </option>
          </select>
        </form-item>
        <!-- 寵物分類（複選） -->
        <form-item label="寵物分類">
          <div class="-m-1">
            <label
              v-for="{ name, id } in pets"
              :key="id"
              class="mx-1 my-3 inline-block cursor-pointer select-none"
            >
              <input
                v-model="filterForm.pets"
                :value="id"
                type="checkbox"
                class="hidden"
              >
              <span class="rounded-xl py-2 px-3 bg-gray-300 hover:bg-gray-500">
                {{ name }}
              </span>
            </label>
          </div>
        </form-item>
        <!-- 寵物分類（開關） -->
        <form-item label="看診狀態">
          <div class="-m-1">
            <label class="mx-1 my-3 inline-block cursor-pointer select-none">
              <input
                v-model="filterForm.status"
                type="checkbox"
                class="hidden"
              >
              <span class="rounded-xl py-2 px-3 bg-gray-300 hover:bg-gray-500">
                看診中
              </span>
            </label>
          </div>
        </form-item>
        <!-- 送出按鈕 -->
        <form-item class="table ml-auto">
          <button
            class="rounded-xl px-3 py-2 bg-gray-500 text-white flex-none focus:outline-none border-2 border-transparent hover:bg-gray-600 mr-2"
            @click="onReset"
          >
            Reset
          </button>
          <button
            class="rounded-xl px-3 py-2 bg-blue-700 text-white flex-none focus:outline-none border-2 border-transparent hover:bg-blue-800"
            @click="onSubmit"
          >
            Search
          </button>
        </form-item>
      </form>
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-inferrable-types */

import { Component, Vue, Model } from 'vue-property-decorator'
import { vetModule } from '@/store'

class FilterForm {
  name: string = ''
  district: number = 0
  pets: string[] = []
  status: boolean = false
}

/**
 * 表格欄位
 */
const FormItem = Vue.extend({
  name: 'FormItem',
  functional: true,
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  render(h, { props, children, data }) {
    const labelNode = props.label && h(
      'label',
      { 
        staticClass: 'mr-4 w-24 flex-shrink-0' 
      },
      props.label
    )

    const itemNode = h(
      'div', 
      {
        ...data,
        staticClass: 'flex items-center mt-4 ' + (data.staticClass || '')
      },
      children && [labelNode, children]
    )

    return itemNode
  }
})


@Component<TheFilterBox>({
  components: {
    FormItem
  }
})
export default class TheFilterBox extends Vue {
  @Model('input', { type: Boolean, default: false }) visibility!: boolean

  filterForm = new FilterForm()

  get districts() {
    return [
      { name: '全部', id: 0 }, 
      ...vetModule.districts
    ]
  }

  get pets() {
    return vetModule.pets
  }

  onClose () {
    this.$emit('input', false)
  }

  onSubmit () {
    type Query = Required<Parameters<typeof vetModule.SET_SEARCH>[0]>
    const { filterForm: form } = this
    const query: Query = {
      search: form.name,
      district: form.district,
      pets: form.pets,
      status: form.status
    }
    vetModule.SET_SEARCH(query)
  }

  onReset() {
    this.filterForm = new FilterForm()
  }

}
</script>

<style lang="scss">

// 目前 tailwind 尚未原生支援
.filter-blur-1 {
  backdrop-filter: blur(.25rem);
}

input[type="checkbox"]:checked + span {
  background-color: #718096;
  color: white;
}

</style>