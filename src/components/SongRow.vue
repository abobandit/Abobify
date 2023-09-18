<script setup>
import {ref, toRefs, onMounted, onBeforeMount, onUnmounted} from 'vue'
// import Heart from '@/components/Heart'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';

import {useSongStore} from '../stores/song'
import {storeToRefs} from 'pinia';
import {useStore} from "../stores";
import instance from "../api/auth";
import router from "../router";

const useSong = useSongStore()
const {isPlaying, queue, currentTrack, currentInstance, currentResource} = storeToRefs(useSong)
const {albums} = storeToRefs(useStore())
let isHover = ref(false)
let isTrackTime = ref(null)
const likedSong = ref('')
const props = defineProps({
  track: Object,
  index: Number,
})
const {track, index} = toRefs(props)
const isEditing = ref(false)
/*const curAlbum = () =>{
  const id = ref(track.value['album_id'])
  const albumById = albums.value.filter(item => item.id ===id.value)
  console.log(albumById)
  return albumById
}
const { track,  index } = toRefs(props)*/
const likeSong = async () => {
  const response = await instance({
    url: 'addToLiked',
    method: 'post',
    data: {
      track_id: track.value.id
    }
  })
  console.log(response.data)
}
const removeFromPlaylist = async () => {
  const response = await instance({
    url: `playlists/${currentInstance.value.id}/${track.id}`,
    method: 'delete',
    data: {
      track_id: track.value.id
    }
  })
  console.log(response.data)
}

onMounted(async () => {
  const audio = new Audio(track.value.path);
  audio.addEventListener('loadedmetadata', function () {
    const duration = audio.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    isTrackTime.value = minutes + ':' + seconds.toString().padStart(2, '0')
  });
})
const toUnHover = async () => {
  if (router.currentRoute.value.name === 'playlist') likedSong.value = ''
  isHover.value = false
}

const fillColor = async (track) => {
  console.log('!!!! ! saa track')
  console.log(track)
  const isInPlaylist = await checkTrackIsLoved('true', track)
  return isInPlaylist ? '#60a6fa' : '#0000004f'
}
const checkTrackIsLoved = async (searchLoved, track, playlist = '') => {
  try {
    console.log('track.value !!! ! ! ! !  ')
    console.log(`check/${track.id}/${searchLoved}${playlist.length ? `/${playlist}` : ''}`)
    // const response = await instance({
    //   url: `check/${track.id}/${searchLoved}+${playlist.length ? `/${playlist}` : ''}`,
    //   headers: {
    //     Authorization: 'Bearer ' + localStorage.getItem('token')
    //   }
    // })
    console.log(response.data.status)

    return response.data.status

  } catch (error) {
    return 'Не получилось сделать запрос';
  }
}
/*const checkTrackInPlaylist = async(searchLoved,track)=>{
  try {
    console.log('track.value !!! ! ! ! !  ')
    console.log(track)
    const response = await instance({
      url: `check/${track.id}/${searchLoved}`,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    console.log(response.data.status)
    return response.data.status
  }
  catch(error){
    return 'Не получилось сделать запрос';
  }
}*/
// const addToPlaylist
const toHoverEl = async () => {
  console.log(track.value)
  if (router.currentRoute.value.name === 'playlist') likedSong.value = await fillColor(track.value)
  console.log(likedSong.value)
  isHover.value = true
}
const playFunc = () => {
    currentResource.value = currentInstance.value
    console.log(currentResource)
    console.log(currentResource?.value)
    queue.value = currentResource.value.tracks
    console.log('track.value')

  if (!isPlaying.value)
    useSong.playOrPauseThisSong(track.value)
  else if (isPlaying.value && currentTrack.value.title !== track.value.title)
    useSong.loadSong(track.value)

}
</script>

<template>
  <li
      class="flex items-center justify-between rounded-md text-[.9rem] pr-4"
      :class="isHover? 'bg-[#2A2929]' : ''"
      @mouseenter="toHoverEl()"
      @mouseleave="toUnHover()"
  >
    <div class="flex items-center w-full py-1.5">
      <div v-if="isHover" class="w-[40px] ml-[14px] mr-[6px] cursor-pointer">
        <Play
            v-if="!isPlaying ||
             (isPlaying && currentTrack.title !== track.title)"
            fillColor="#FFFFFF"
            :size="25"
            @click="playFunc()"
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
        <div v-if="router.currentRoute.value.name==='album'"
             class="text-sm font-semibold text-gray-400">{{ currentInstance.artists[0].name }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <button type="button" v-if="isHover ">
        <Heart :fillColor="likedSong" :size="22"/>
        <button v-if=" router.currentRoute.value.name === 'playlist'" type="button">
          <DotsHorizontal class="relative" @click="isEditing = !isEditing" fillColor="#FFFFFF" :size="25"/>
          <div v-if="isEditing"
               class="absolute w-[190px] bg-[#282828] shadow-2xl z-50 rounded-sm  p-1 cursor-pointer">
            <ul class="text-gray-200 font-semibold text-[14px]">
              <li @click="removeFromPlaylist('false',)"
                  class="px-3 py-2.5 hover:bg-[#3E3D3D] border-b border-b-gray-600">
                Удалить из плейлиста
              </li>
            </ul>
          </div>
        </button>
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
