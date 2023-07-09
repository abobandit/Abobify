<script setup>
import {toRefs} from 'vue'
import {RouterLink} from 'vue-router';
const props = defineProps({
  image: String,
  title: String,
  subTitle: String
})
const {image, title, subTitle} = toRefs(props)
</script>

<template>

    <div class="bg-[#111111] p-4 rounded-md m-2 hover:bg-[#252525] cursor-pointer">
      <img class="rounded-md  h-[200px] w-[200px]" height="200"  width="200" :src="image" :alt="title"><slot></slot>
      <div class="text-white pt-4 font-semibold text-[17px]">{{ title }}</div>
      <div class="text-gray-400 pt-1 pb-3 text-[14px]">{{ subTitle }}</div>

    </div>

</template>
