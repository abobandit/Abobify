<template>
  <div id="SideNav" class="h-[100%] p-6 w-[240px] right-0 fixed z-50 bg-black">
    <RouterLink to="/home">
      <img class="rounded-full" width="125" src="/images/icons/sigmaheadphones.jpg">
    </RouterLink>
    <div class="my-8"></div>
    <ul>
      <RouterLink to="/home">
        <MenuItem class="ml-[1px]" :iconSize="23" name="Home" iconString="home" pageUrl="/" />
      </RouterLink>
      <RouterLink to="/search">
        <MenuItem class="ml-[1px]" :iconSize="24" name="Search" iconString="search" pageUrl="/search" />
      </RouterLink>
      <RouterLink to="/library">
        <MenuItem class="ml-[2px]" :iconSize="23" name="Your Library" iconString="library" pageUrl="/library" />
      </RouterLink>
      <div class="py-3.5"></div>
      <MenuItem :iconSize="24" name="Create Playlist" iconString="playlist" pageUrl="/playlist" />
      <MenuItem class="-ml-[1px]" :iconSize="27" name="Liked Songs" iconString="liked" pageUrl="/liked" />
    </ul>
    <div class="border-b border-b-gray-700"></div>
    <ul>
      <playlist-item></playlist-item>
    </ul>
  </div>
</template>

<script setup>
import MenuItem from '/src/components/MenuItem.vue';
import PlaylistItem from "/src/components/PlaylistItem.vue";
import {RouterLink} from 'vue-router'
</script>

<style scoped>

</style>
