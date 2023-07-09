<template>
  <template v-if="!(title==='Любимые треки')">
      <li class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white"> {{ title }}</li>
  </template>
</template>

<script setup>
import {toRefs} from "vue";

const props = defineProps({
  title: {
    type: String
  }
})
const {title} = toRefs(props)
</script>

<style scoped>

</style>
