<template>
  <template v-if="!(title==='Любимые треки')">
      <li :class="pageUrl === router.currentRoute.value.fullPath ? 'text-white' : 'text-gray-400'"
          class="font-semibold text-[13px] mt-3 hover:text-white"> {{ title }}</li>
  </template>
</template>

<script setup>
import {toRefs} from "vue";
import router from '../router'
const props = defineProps({
  title: String,
  pageUrl: String
})
const {title,pageUrl} = toRefs(props)



</script>

<style scoped>

</style>
