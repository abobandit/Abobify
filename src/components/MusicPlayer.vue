<script setup>
import { ref, watch, onMounted } from 'vue'
import MusicPlayerVolume from '../components/MusicPlayerVolume.vue'
// import Heart from '@/components/Heart'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import SkipBackward from 'vue-material-design-icons/SkipBackward.vue';
import SkipForward from 'vue-material-design-icons/SkipForward.vue';

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentArtist } = storeToRefs(useSong)

let isHover = ref(false)
let isTrackTimeCurrent = ref(null)
let isTrackTimeTotal = ref(null)
let seeker = ref(null)
let seekerContainer = ref(null)
let range = ref(0)

onMounted(() => {

    if (audio.value) {
        setTimeout(() => {

            timeupdate()
            loadmetadata()
        }, 300)
    }

    if (currentTrack.value) {
        seeker.value.addEventListener("change", function () {
            const time = audio.value.duration * (seeker.value.value / 100);
            audio.value.currentTime = time;
        });

        seeker.value.addEventListener("mousedown", function () {
            audio.value.pause();
            isPlaying.value = false
        });

        seeker.value.addEventListener("mouseup", function () {
            audio.value.play();
            isPlaying.value = true
        });

        seekerContainer.value.addEventListener("click", function (e) {
            const clickPosition = (e.pageX - seekerContainer.value.offsetLeft) / seekerContainer.value.offsetWidth;
            const time = audio.value.duration * clickPosition;
            audio.value.currentTime = time;
            seeker.value.value = (100 / audio.value.duration) * audio.value.currentTime;
        });
    }
})
function showTime() {
  let minutes = Math.floor(audio.value.currentTime / 60);
  let seconds = Math.floor(audio.value.currentTime - minutes * 60);
  isTrackTimeCurrent.value = minutes+':'+seconds.toString().padStart(2, '0')
  const value = (100 / audio.value.duration) * audio.value.currentTime;
  range.value = value
  seeker.value.value = value;
}
const timeupdate = () => {
  audio.value.addEventListener("timeupdate",showTime);
}

const loadmetadata = () => {
    audio.value.addEventListener('loadedmetadata', function() {
        const duration = audio.value.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTimeTotal.value = minutes+':'+seconds.toString().padStart(2, '0')
    });
}
watch(() => audio.value, () => {

  loadmetadata()
  timeupdate()
})

watch(() => isTrackTimeCurrent.value, (time) => {
    if (time && time == isTrackTimeTotal.value) {
        useSong.nextSong(currentTrack.value)
    }
})

</script>

<template>
  <div
      id="MusicPlayer"
      v-if="audio"
      class="
            fixed
            bottom-0
            w-full
            z-50
            h-[90px]
            bg-[#181818]
            border-t
            border-t-[#272727]
        "
  >
    <div class="flex items-start h-[25px]">
      <div v-if="isTrackTimeCurrent" class="text-white text-[12px] pr-2 pt-[1px]">{{ isTrackTimeCurrent }}</div>
      <div
          ref="seekerContainer"
          class="w-full relative mb-3"
          @mouseenter="isHover = true"
          @mouseleave="isHover = false"
      >
        <input
            v-model="range"
            @input="useSong.playOrPauseThisSong(currentArtist, currentTrack)"
            ref="seeker"
            type="range"
            class="
                                absolute
                                rounded-full
                                w-full
                                h-0
                                z-40
                                appearance-none
                                focus:outline-none
                            "
            :class="{ 'rangeDotHidden': !isHover }"
        >
        <div
            class="pointer-events-none absolute h-[4px] z-10 inset-y-0 left-0 w-0"
            :style="`width: ${range}%;`"
            :class="isHover ? 'bg-blue-400' : 'bg-white'"
        />
        <div class="absolute h-[4px] z-[-0] inset-y-0 left-0 w-full bg-gray-500 rounded-full" />

      </div>
      <div v-if="isTrackTimeTotal" class="text-white text-[12px] pl-2 pt-[11px]">{{ isTrackTimeTotal }}</div>
    </div>
    <div
        class="flex items-center justify-between">
      <div class="flex items-center w-1/4">
        <div class="flex-col items-center justify-center">
          <div class="buttons flex items-center justify-center h-[30px]">
            <button class="mx-2">
              <SkipBackward fillColor="#FFFFFF" :size="25" @click="useSong.prevSong(currentTrack)"/>
            </button>
            <button class="p-1 rounded-full mx-3 bg-white" @click="useSong.playOrPauseThisSong(currentArtist, currentTrack)">
              <Play v-if="!isPlaying" fillColor="#181818" :size="25" />
              <Pause v-else fillColor="#181818" :size="25" />
            </button>
            <button class="mx-2">
              <SkipForward fillColor="#FFFFFF" :size="25" @click="useSong.nextSong(currentTrack)"/>
            </button>
          </div>



        </div>
        <div class="flex items-center ml-4">
          <img class="rounded-sm shadow-2xl" width="55" :src="currentArtist.albumCover">
          <div class="ml-4">
            <div class="text-[14px] text-white hover:underline cursor-pointer">
              {{ currentTrack.name }}
            </div>
            <div class="text-[11px] text-gray-500 hover:underline hover:text-white cursor-pointer">
              {{ currentArtist.name }}
            </div>
          </div>
        </div>
        <div class="flex items-center ml-8">
          <Heart fillColor="#60a6fa" :size="20" />

        </div>
      </div>


      <div class="flex items-center w-1/4 justify-end pr-10">
        <MusicPlayerVolume />
      </div>
    </div>



  </div>
</template>

<style>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
}
</style>
