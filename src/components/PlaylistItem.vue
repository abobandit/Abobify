<template>
  <router-link :to="{path:'/playlists/:1'}">
    <li class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white">Playlist name</li>
  </router-link>
</template>

<script>
export default {
  name: "PlaylistItem"
}
</script>

<style scoped>

</style>
