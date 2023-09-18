<script setup>
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useSongStore} from "@/stores/song";
import instance from "@/api/auth";
const useSong = useSongStore()
const {backPath} = storeToRefs(useSong)
const inputValue = ref('')
const fileValue = ref('')
const input = (val) => {
  console.log(val.value)
}
const uploadTrack = async() =>{
  const response = await instance({
    url: 'tracks',
    method: "POST",
    body:{

    }
  })
  return response.value
}
</script>

<template>
  <form method="post" :action="backPath" enctype="multipart/form-data">
    <FileInputUI :title="'Загрузить трек'" :accept="'image/mp3'"/>
    <h1>Загрузить трек</h1>
    <InputUi v-model="inputValue"/>
    <ButtonUi @click="uploadTrack" :type="'submit'"/>
  </form>
</template>

<style scoped>

</style>