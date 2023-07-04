<template>
  <router-view/>
</template>

<script setup>
import {onBeforeMount, onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useUserStore} from "./stores/user";
import {useSongStore} from "./stores/song";

document.title ='Aboba'

onBeforeMount(()=>{
  if (localStorage.getItem('token')){
    const {token,isAuth,role} = storeToRefs(useUserStore())
    token.value = localStorage.getItem('token')
    isAuth.value = true
    role.value = localStorage.getItem('role')
    console.log(token)
  }

})
onMounted(()=>{
  const {isPlaying} = storeToRefs(useSongStore())
  isPlaying.value = false
})
</script>
<style>
body{
  font-size: 20px;
}
</style>
