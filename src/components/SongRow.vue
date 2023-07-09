<script setup>
import {ref, toRefs, onMounted, onBeforeMount} from 'vue'
// import Heart from '@/components/Heart'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';

import {useSongStore} from '../stores/song'
import {storeToRefs} from 'pinia';
import {useStore} from "../stores";
import instance from "../api/auth";
import router from "../router";

const useSong = useSongStore()
const {isPlaying, currentTrack, currentResource, currentArtist} = storeToRefs(useSong)
const {albums} = storeToRefs(useStore())
let isHover = ref(false)
let isTrackTime = ref(null)

const props = defineProps({
  track: Object,
  index: Number,
})
const {track, index} = toRefs(props)
/*const curAlbum = () =>{
  const id = ref(track.value['album_id'])
  const albumById = albums.value.filter(item => item.id ===id.value)
  console.log(albumById)
  return albumById
}
const { track,  index } = toRefs(props)*/

onMounted(async () => {
  // curAlbum()
  /*try {
    const currentTrackRow = await instance({
      url: 'albums',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
  } catch (e) {
    console.log('Альбомов нет')
  }*/

  const audio = new Audio(track.value.path);
  audio.addEventListener('loadedmetadata', function () {
    const duration = audio.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    isTrackTime.value = minutes + ':' + seconds.toString().padStart(2, '0')
  });
})
</script>

<template>
  <li
      class="flex items-center justify-between rounded-md hover:bg-[#2A2929] text-[.9rem] pr-4"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
  >
    <div class="flex items-center w-full py-1.5">
      <div v-if="isHover" class="w-[40px] ml-[14px] mr-[6px] cursor-pointer">
        <Play
            v-if="!isPlaying"
            fillColor="#FFFFFF"
            :size="25"
            @click="useSong.playOrPauseThisSong(useSong.getAlbum( 'artists')[0], track)"

        />

        <Play
            v-else-if="isPlaying && currentTrack.title !== track.title"
            fillColor="#FFFFFF"
            :size="25"
            @click="useSong.loadSong(useSong.getAlbum( 'artists')[0], track)"

        />
        <Pause v-else fillColor="#FFFFFF" :size="25" @click="useSong.playOrPauseSong()"/>
      </div>
      <div v-else class="text-white font-semibold w-[40px] ml-5">
                <span :class="{'text-blue-400': currentTrack && currentTrack.title === track.title}">
                    {{ index }}
                </span>
      </div>
      <div>
        <div
            :class="{'text-blue-400': currentTrack && currentTrack.title === track.title}"
            class="text-white font-semibold"
        >
          {{ track.title }}
        </div>
        <div v-if="currentResource.artists" class="text-sm font-semibold text-gray-400">{{ currentResource.artists[0].name }}</div>
      </div>
    </div>
    <div class="flex items-center">
      <button type="button" v-if="isHover">
        <Heart fillColor="#60a6fa" :size="22"/>
      </button>
      <div
          v-if="isTrackTime"
          class="text-xs mx-5 text-gray-400"
      >
        {{ isTrackTime }}
      </div>
    </div>
  </li>
</template>
