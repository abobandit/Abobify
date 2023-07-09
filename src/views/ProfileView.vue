<template>
  <div class="relative left-0 top-[-70px] p-12 pt-[70px] min-h-[240px] w-full bg-[#388890] pointer-events-none ">
    <div id="shadow" class="h-full left-0 absolute top-0 w-full pointer-events-none"></div>
  </div>
  <div class="absolute top-[70px] left-[1rem]">
    <div v-if="!isEditing" class="text-white">
      <h2 class="text-4xl">Профиль</h2>

      <ul >
        <li>Ваш логин <span>{{ user.login }}</span></li>
        <li>Ваш email <span>{{ user.email }}</span></li>
        <li>Ваш пароль <span>*****</span></li>

      </ul>
    </div>
    <div v-else class="text-black flex flex-col">
      <h2 class="text-2xl">Editing profile settings</h2>
      <input :value="user.login"
             class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 active:bg-gray-200 mb-2"
             placeholder="Insert your new login" type="text">
      <input :value="user.email"
             class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 active:bg-gray-200 mb-2"
             placeholder="Insert your new email" type="email">
      <div class="flex">
        <input :value="user.password"
               class="w-min px-1 py-0.5 mr-2 rounded-lg outline-none hover:bg-gray-100 active:bg-gray-200 mb-2"
               placeholder="Insert your new password" :type="hasClicked?'text':'password'">

<!--               @click="hasClicked = !hasClicked" type="button">-->
      </div>

    </div>
    <input
        @click="isEditing = !isEditing"
        class="outline-none bg-white rounded-lg text-black px-1 py-0.5 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
        :value="isEditing?'Done':'Edit'" type="button">
  </div>
  <div class="text-white mb-10">
    <h3 class="text-3xl mb-5">Топ треков этого месяца</h3>
    <ul class="w-full" v-for="(track, index) in recentlyListened()" :key="track">
      <SongRow  :track="track" :index="++index"/>
    </ul>
  </div>
  <div class="block w-full text-white">
    <h3 class="text-3xl mb-5">Недавно прослушано</h3>
    <div
        class="flex" >
      <HomeCard  v-for="track in recentlyListened()" class="w-48 relative " :image="backPath + currentResource.og_image" :title="track.name" :subTitle="artist.name" >
        <button class="p-1 rounded-full bg-white absolute right-6 top-[8.5rem] hidden hover:visible" @click="playFunc()">
          <Play class="" v-if="!isPlaying" fillColor="#181818" :size="25"/>
          <Pause class="inherit" v-else fillColor="#181818" :size="25"/>
        </button>
      </HomeCard>
    </div>
  <div class="block w-full text-white">
    <h3 class="text-3xl mb-5">Рекомендуем</h3>
    <div
        class="flex" >
      <HomeCard  v-for="track in recentlyListened()" class="w-48 relative " :image="backPath + currentResource.og_image" :title="track.title" :subTitle="useSong.getArtist().name" >
        <button class="p-1 rounded-full bg-white absolute right-6 top-[8.5rem] hidden hover:visible" @click="playFunc()">
          <Play class="" v-if="!isPlaying" fillColor="#181818" :size="25"/>
          <Pause class="inherit" v-else fillColor="#181818" :size="25"/>
        </button>
      </HomeCard>
    </div>
  </div>
</div>
</template>

<script setup>
import {useUserStore} from "../stores/user";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';

import HomeCard from "../components/HomeCard.vue"
import {useSongStore} from "../stores/song";
import SongRow from "../components/SongRow.vue"

const useUser = useUserStore()
const {user} = storeToRefs(useUser)
const isEditing = ref(false)
const hasClicked = ref(false)

const useSong = useSongStore()
const { isPlaying, currentTrack, currentArtist ,currentResource} = storeToRefs(useSong)

let isHovered = ref(false)

const playFunc = () => {
  if (currentTrack.value) {
    useSong.playOrPauseThisSong(currentArtist.value, currentTrack.value)
    return
  }
  useSong.playFromFirst()
}
const recentlyListened = () => {
  let counter = 0
  let tracks  = []
  for(let i of currentResource.tracks){
    if(!(counter<5)) return tracks
    tracks.push(i)
    console.log(tracks)
    counter++
  }
}
</script>

<style scoped>
#shadow{
  background: -webkit-gradient(linear,left top,left bottom,from(transparent),to(rgba(0,0,0,.45))), rgba(0, 0, 0, .05);
}

</style>
