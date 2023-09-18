<script>
export default {
  name:'FileInputUI'
}
</script>
<script setup>
import {ref} from "vue";

const props = defineProps({
  acceptType:String,
  title: String
})

const file = ref()
const previewFile = (event) =>{
  file.value = event.target.files[0]
  console.log(event.target.files)
}
</script>

<template>
  <label class=" border-[5px] border-white bg-black font-bold text-[.9rem] text-white rounded-2xl inline-block py-3 px-4 cursor-pointer">
    {{ title }}
  <input
      :accept="acceptType"
      @change="previewFile"
      type="file"
      class="hidden text-white"
  >
    <span v-if="value">{{value}}</span>
 </label>
</template>
