<template>
  <div class="border border-black w-fit">
    <h1>{{ title}}</h1>
<!--    <h1>asfdsf</h1>
    <input @click="click()" value="input"
           type="button">-->
  </div>

</template>

<script setup>
import {toRefs, watch} from "vue";

const props = defineProps({
  title: String
})
const {title} = toRefs(props)
const click = () =>{
  console.log(title)
}
</script>

<style scoped>

</style>
