<script>
export default {
  name:'ButtonUi'
}
</script>
<script setup>
import {toRef} from "vue";

const props = defineProps({
  value: {
    type:String,
    default: 'Отправить'
  },
  btnType: {
    type:String,
    default: 'button'
  }
})
const {value,btnType} = toRef(props)
</script>

<template>
  <input
         class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white "
         :value="value"
         :type="btnType">
</template>

<style scoped>

</style>