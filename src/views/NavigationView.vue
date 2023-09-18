<template>
  <div>
    <div
        id="TopNav"
        class="
            w-[calc(100%-240px)]
            h-[60px]
            fixed
            left-0
            z-20
            bg-[#101010]
            bg-opacity-80
            flex
            items-center
            justify-between
          "
    >
      <div class="flex items-center ml-6">
        <button type="button" class="rounded-full bg-black p-[1px] cursor-pointer">
          <ChevronLeft fillColor="#FFFFFF" @click="$router.go(-1)" :size="30"/>
        </button>
        <button type="button" class="rounded-full bg-black p-[1px] hover:bg-[#] ml-4 cursor-pointer">
          <ChevronRight fillColor="#FFFFFF" @click="$router.go(1)" :size="30"/>
        </button>
      </div>
      <button @click.stop="openMenu = !openMenu" :class="openMenu ? 'bg-[#282828]' : 'bg-black'"
              class="bg-black hover:bg-[#282828] w-[190px]  rounded-full p-1 mr-8 mt-0.5 cursor-pointer">
        <div class="flex flex-1 justify-between w-full">
          <div class=" hidden sm:flex sm:flex-1 ">
            <img
                class="rounded-full w-[38px] h-[30px] mr-1"
                src="/public/images/icons/sigmaheadphones.jpg"
            >
            <p class="text-white">{{ login }}</p>
          </div>

          <div class="mr-1">
            <ChevronDown v-if="!openMenu" @click.stop="openMenu = true" fillColor="#FFFFFF" :size="25"/>
            <ChevronUp v-else @click.stop="openMenu = false" fillColor="#FFFFFF" :size="25"/>
          </div>

        </div>
      </button>

      <div v-if="openMenu"
           class="fixed w-[190px] bg-[#282828] shadow-2xl z-50 rounded-sm top-[51px] right-[272px] p-1 cursor-pointer">
        <ul class="text-gray-200 font-semibold text-[14px]">
          <li @click="$router.push('/profile')"
              class="px-3 py-2.5 hover:bg-[#3E3D3D] border-b border-b-gray-600">Профиль
          </li>
          <li v-if="role==='admin'" @click="$router.push('/admin')"
              class="px-3 py-2.5 hover:bg-[#3E3D3D] border-b border-b-gray-600">Админ панель
          </li>
          <li @click="lOut()" class="px-3 py-2.5 hover:bg-[#3E3D3D]">Выйти</li>
        </ul>
      </div>
    </div>

    <SideNav/>
  </div>

  <div
      class="
            left-0
            top-0
            w-[calc(100%-240px)]
            overflow-auto
            min-h-[100vh]
            bg-gradient-to-b
            from-[#1C1C1C]
            to-black
        "
  >
    <div class="mt-[70px] mb-[100px]">
    <RouterView/>
  </div>
  </div>
  <MusicPlayer v-if="currentTrack"/>

</template>

<script setup>
import SideNav from '../components/SideNav.vue'
import {RouterView} from 'vue-router'
import MusicPlayer from '../components/MusicPlayer.vue'

import ChevronUp from 'vue-material-design-icons/ChevronUp.vue';
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue';

import {useUserStore} from "../stores/user";
import {useSongStore} from '../stores/song'
import {ref} from 'vue'
import router from "../router";

import {storeToRefs} from 'pinia';
const useSong = useSongStore()
const user = useUserStore()

const lOut = () => {
  user.logout()
  useSong.resetState()
  router.push('/login')
}

const {role,login} = storeToRefs(user)

const currentTrack = storeToRefs(useSong)

const openMenu = ref(false)


</script>
