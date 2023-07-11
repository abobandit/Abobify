<template>
  <router-view/>
</template>

<script setup>
import {onBeforeMount, onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useUserStore} from "./stores/user";
import {useSongStore} from "./stores/song";
import instance from "./api/auth";
import {useStore} from "./stores";

document.title ='Aboba'

onBeforeMount(  ()=>{
  if (localStorage.getItem('token')){
    const {token,isAuth,role} = storeToRefs(useUserStore())
    token.value = localStorage.getItem('token')
    isAuth.value = true
    role.value = localStorage.getItem('role')
    /*const authUser= async () =>{
      try{
        const request = await instance({
          method:'get',
          url: 'authUser',
        })
        console.log(await request.data)
        return request.data
      }catch (e) {

      }
    }
    authUser()*/
  }

})

onMounted(()=>{
  const {isPlaying} = storeToRefs(useSongStore())
  isPlaying.value = false

})
</script>
<style>
#app{
  min-height: 100vh ;
}
body{
  font-size: 20px;
}
</style>
