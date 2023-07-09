<template>
  <div id="SideNav" class="flex flex-col flex-1 h-[100%] p-6 w-[240px] right-0 fixed z-50 bg-black">
    <RouterLink to="/home">
      <img class="rounded-full" width="125" src="/images/icons/sigmaheadphones.jpg">
    </RouterLink>
    <div class="my-8"></div>
    <ul>
      <RouterLink to="/home">
        <MenuItem class="ml-[1px]" :iconSize="23" name="Главная" iconString="home" pageUrl="/"/>
      </RouterLink>
      <RouterLink to="/search">
        <MenuItem class="ml-[1px]" :iconSize="24" name="" iconString="search" pageUrl="/search"/>
      </RouterLink>
      <RouterLink to="/library">
        <MenuItem class="ml-[2px]" :iconSize="23" name="Твоя медиатека" iconString="library" pageUrl="/library"/>
      </RouterLink>
      <div class="py-3.5"></div>
      <MenuItem :iconSize="24" @click="createPlaylist()" name="Создать плейлист" iconString="playlist"
                pageUrl="/playlist"/>
      <router-link :to="'/playlists/likedSongs'">
        <MenuItem class="-ml-[1px]" :iconSize="27" name="Понравившееся" iconString="liked" pageUrl="/liked"/>
      </router-link>
    </ul>
    <div class="border-b border-b-gray-700"></div>
    <template v-if="playlists">
      <ul class="text-gray-200" v-for="playlist in playlists">
        <playlist-item :title="playlist.title" @click="goToPlaylist(playlist)"/>
      </ul>
    </template>


  </div>
</template>

<script setup>
import MenuItem from '/src/components/MenuItem.vue';
import PlaylistItem from "/src/components/PlaylistItem.vue";
import {RouterLink} from 'vue-router'
import instance from "../api/auth";
import adminGetInstance from "../api/adminGetInstance";
import {onBeforeMount, watch} from "vue";
import {storeToRefs} from "pinia";
import {useStore} from "../stores";
import {useUserStore} from "../stores/user";
import router from "../router";
import {useSongStore} from "../stores/song";


const goToPlaylist = async (passedPlaylist) => {
  await router.push({
    name: 'playlist',
    params: {
      playlist: passedPlaylist.id
    }
  })
  console.log(passedPlaylist.id)
}
const createPlaylist = async () => {
  try {
    const response = await instance({
      method: 'post',
      url: 'playlists',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    console.log(response.data)
    playlists.value.push(response.data)
    return response.data
  } catch (e) {
    console.log('Не получилось создать плейлист')
  }
}
onBeforeMount(async () => {
  const {isAuth} = storeToRefs(useUserStore())
  const {playlists} = storeToRefs(useStore())
  console.log(localStorage.getItem('token'))
  const getPlaylists = async () => {
    const response = await instance({
      url: 'playlists',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    console.log(response.data)
    return response.data
  }
  try {
    playlists.value = await getPlaylists()
  } catch (e) {
    console.log('Плейлисты не были получены')
  }


})
const {playlists} = storeToRefs(useStore())
</script>

<style scoped>

</style>
