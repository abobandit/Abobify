<script setup>
import SongRow from '../components/SongRow.vue'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue';
import ClockTimeThreeOutline from 'vue-material-design-icons/ClockTimeThreeOutline.vue';

import {useSongStore} from '../stores/song'
import {storeToRefs} from 'pinia';
import {useStore} from "../stores";
import {toRefs} from "vue";
import router from "../router";
import instance from "../api/auth";

const useSong = useSongStore()

const props = defineProps({
  image: String
})
const {image} = toRefs(props)
const {isPlaying, currentTrack, currentArtist, currentResource,elem,queue} = storeToRefs(useSong)
const {tracks, artists, albums} = storeToRefs(useStore())

const playFunc =  () => {
  if (currentTrack.value) {
    try{
      useSong.playOrPauseThisSong(currentArtist.value, currentResource.tracks[0])
      return
    }catch (e) {
      console.log(e)
    }

  }
  useSong.playFromFirst()
}

/*onUpdated(async ()=>{
  console.log('im here')
  let resourcePath
  const {currentResource} = storeToRefs(useSongStore())
  currentResource.value = await useSong.getAlbum()
  // Если имя маршрута Альбом то ссылка на картинку берется из значения ресурса, в противном случае из дебрей
  if(router.currentRoute.value.name === 'album') {
    resourcePath = await currentResource.value.og_image
    elem.value['path'] = backPath.value +  await resourcePath
  }else {
    try{
      resourcePath = (await instance({
        url: `albums/${await currentResource.value.tracks[0].album_id}`,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }})).data.og_image
      elem.value['path'] = backPath.value +  await resourcePath
    } catch {
        elem.value['path']  = false
    }
    // console.log(resourcePath)

  }


  // console.log('123'+elem.value.path  )
  // console.log(router.currentRoute.value.path.substring(1))
})*/
const test = (str)=>{
  console.log(str)
}



</script>

<template>
  <div class="bg-[#101010]">
    <div class="p-8 overflow-x-hidden">
      <button
          type="button"
          v-if="currentResource"
          class="text-white text-2xl font-semibold hover:underline cursor-pointer"
      >

        {{ currentResource.title }}
      </button>

      <div class="py-1.5"></div>
      <div class="flex items-center w-full relative h-full">

          <img v-if="currentResource"  class="text-white w-[140px] h-[140px]" :src="elem['path']" alt="Cover">


<!--        <img v-else class="w-[140px] h-[140px]" src="/images/icons/sigmaheadphones.jpg" alt="Cover">-->

        <div class="w-full ml-5">

          <div
              v-if="currentResource"
              style="font-size: 33px;"
              class="text-white absolute w-full hover:underline cursor-pointer top-0 font-bosemiboldld"
          >
            {{ currentResource.title }}
          </div>

          <div class="text-gray-300 text-[13px] flex">
            <div class="flex">{{ elem.type }}</div>
<!--            <div v-if="currentResource.releaseYear" class="ml-2 flex">
              <div class="circle mt-2 mr-2"/>
              <span class="-ml-0.5">{{ currentResource.releaseYear }}</span>
            </div>-->
            <div class="ml-2 flex">
              <div class="circle mt-2 mr-2"/>
              <span v-if="currentResource" class="-ml-0.5">{{ currentResource.tracks.length }} songs</span>
            </div>
          </div>

          <div class="absolute flex gap-4 items-center justify-start bottom-0 mb-1.5">
            <button class="p-1 rounded-full bg-white" @click="playFunc()">
              <Play v-if="!isPlaying" fillColor="#181818" :size="25"/>
              <Pause v-else fillColor="#181818" :size="25"/>
            </button>
            <button type="button">
              <Heart fillColor="#37D4D7" :size="30"/>
            </button>
            <button type="button">
              <DotsHorizontal fillColor="#FFFFFF" :size="25"/>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6"></div>
      <div class="flex items-center justify-between px-5 pt-2">
        <div class="flex items-center justify-between text-gray-400">
          <div class="mr-7">#</div>
          <div class="text-sm">Title</div>
        </div>
        <div>
          <ClockTimeThreeOutline fillColor="#FFFFFF" :size="18"/>
        </div>
      </div>
      <div class="border-b border-b-[#2A2A2A] mt-2"></div>
      <div class="mb-4"></div>
      <template v-if="currentResource">
        <ul class="w-full" v-for="(track, index) in currentResource.tracks" :key="track">
          <!--        <SongRow :currentResource="currentResource" :track="track" :index="++index"/>-->
          <SongRow :track="track" :index="++index"/>
        </ul>
      </template>

    </div>
  </div>


</template>

<style scoped>
.circle {
  width: 4px;
  height: 4px;
  background-color: rgb(189, 189, 189);
  border-radius: 100%;
}
</style>


