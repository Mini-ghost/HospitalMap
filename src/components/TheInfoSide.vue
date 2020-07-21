<template>
  <transition
    name="__fade"
    appear
  >
    <div
      v-if="vetDetail"
      :key="vetDetail.name"
      class="info absolute md:inset-4 inset-0 top-32 md:max-w-md w-full bg-gray-100 p-5 pr-0 md:rounded-xl rounded-t-xl shadow-xl"
    >
      <div class="pr-5 overflow-y-auto h-full custom-x-scrollbar">
        <header class="info-header">
          <!-- 標題 -->
          <h2 class="text-3xl font-bold">
            {{ vetDetail.name }}
          </h2>
          <!-- 營業資訊 -->
          <ul class="text-sm font-bold my-4 select-none">
            <li
              v-if="vetDetail.is24hr"
              class="border border-green-500 bg-green-500 text-white rounded-lg inline-block px-2 py-1 mr-1"
            >
              24hr
            </li>
            <li
              class="border rounded-lg inline-block px-2 py-1"
              :class="isOpen ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'"
            >
              {{ isOpen ? '看診中' : '休息中' }}
            </li>
          </ul>
        </header>
        <hr>
        <main class="my-4">
          <!-- 基本資訊 -->
          <section class="mb-5 last:mb-0">
            <h3 class="text-2xl font-bold">
              基本資訊
            </h3>
            <ul class="bg-gray-200 rounded-lg text-sm my-2">
              <li class="border-gray-300 border-b last:border-b-0 py-3 px-4">
                {{ vetDetail.address }}
              </li>
              <li class="border-gray-300 border-b last:border-b-0 py-3 px-4">
                {{ vetDetail.phone }}
              </li>
              <li class="border-gray-300 border-b last:border-b-0 py-3 px-4">
                {{ vetDetail.time }}
              </li>
              <li class="border-gray-300 border-b last:border-b-0 py-3 px-4">
                <a
                  v-if="vetDetail.webURL"
                  :href="vetDetail.webURL"
                  target="_blank"
                  rel="noopener"
                > {{ vetDetail.webURL }}  </a>
                <template v-else>
                  尚無網站連結
                </template>
              </li>
            </ul>
          </section>
          <!-- 看診動物 -->
          <section class="mb-5 last:mb-0">
            <h3 class="text-2xl font-bold ">
              看診動物
            </h3>
            <div class="text-gray-600 my-2 select-none">
              <template v-for="(pet, index) in vetDetail.pet">
                {{ pet }}
                <template v-if="index !== vetDetail.pet.length - 1">
                  、
                </template>
              </template>
            </div>
          </section>
          <!-- 看診項目 -->
          <section class="mb-5 last:mb-0">
            <h3 class="text-2xl font-bold ">
              看診項目
            </h3>
            <div class="text-gray-600 my-2 select-none">
              <template v-for="(service, index) in vetDetail.service">
                {{ service }}
                <template v-if="index !== vetDetail.service.length - 1">
                  、
                </template>
              </template>
            </div>
          </section>
          <section class="mb-5 last:mb-0">
            <h3 class="text-2xl font-bold ">
              看診時間
            </h3>
            <table class="w-full text-left border-collapse border border-gray-300 my-2">
              <tbody class="align-baseline">
                <tr
                  v-for="i in 7"
                  :key="i"
                  :class="(today === i - 1) && 'bg-gray-300'"
                  class="hover:bg-gray-300"
                >
                  <th class="p-2 border-t border-gray-300 text-sm whitespace-no-wrap">
                    {{ dayOfWeeksName[i - 1] }}
                  </th>
                  <td class="p-2 border-t border-gray-300 text-sm whitespace-pre">
                    {{ vetDetail.detailTime[i - 1] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { vetModule } from '@/store'

@Component<TheInfoSide>({
  name: 'TheInfoSide'
})
export default class TheInfoSide extends Vue {
  dateInstance = new Date()

  get today () {
    return this.dateInstance.getDay() - 1 !== -1
      ? this.dateInstance.getDay() - 1
      : 6
  }

  get vetDetail () {
    return vetModule.vetDetail
  }

  get dayOfWeeksName () {
    return ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  }

  /**
   * 確認是否看診中
   */
  get isOpen () {
    const comparison: boolean[] = []
    let hours: string | number = this.dateInstance.getHours()
    let minutes: string | number = this.dateInstance.getMinutes()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ranges = this.vetDetail!
      .detailTime[this.today]
      .split(', ')

    const analysisIsOpen = (test: string[]) => {
      const [ start, end ] = test

      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes

      const now = `${hours}:${minutes}`

      now > start && now < end
        ? comparison.push(true)
        : comparison.push(false)
    }

    for(let i = 0, l = ranges.length; i < l; i++) {
      const range = ranges[i]
      range !== undefined && range !== '休息'
        ? analysisIsOpen(range.split('–'))
        : comparison.push(false)
    }
    return comparison.some(state => state)
  }
}
</script>

<style lang="scss">
@mixin -webkit-custom-scrollbar {
  overflow-y: auto;
  -webkit-overflow-scrolling: auto;
  &::-webkit-scrollbar {
    width: 14px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(gray, .25);
    border-radius: 8px;
    background-clip: padding-box;
    border: 4px solid transparent;
    &:hover {
      background-color: rgba(gray, .5);
    }
  }
}

@mixin -moz-custom-scrollbar {
  scrollbar-color: rgba(gray, .75) transparent;
  scrollbar-width: thin;
}

.custom-x-scrollbar {
  @include -webkit-custom-scrollbar;
  @include -moz-custom-scrollbar
}
</style>
