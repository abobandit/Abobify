<script setup>
import HomeCard from '../components/HomeCard.vue';
import {onBeforeMount, onMounted, ref} from "vue";
import {storeToRefs} from "pinia/dist/pinia";
import {useStore} from "../stores";
import instance from "../api/auth";
import {useSongStore} from "../stores/song";
import router from "../router";

let useSong = useSongStore();
const {backPath} = storeToRefs(useSong)
const {albums, genres} = storeToRefs(useStore())
/*const findGenre = (gName) =>{
    return genres.value.filter(item => item.name === gName)
}*/
onMounted(async () => {
  const {tracks, artists, albums, genres} = storeToRefs(useStore())
  const getArtists = async () => {
    const response = await instance({
      method: 'get',
      url: 'artists',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    console.log(response.data)
    return (response.data)
  }
  /*const getGenres = async () => {
    const response = await instance({
      method: 'get',
      url: 'genres',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    console.log(response.data)
    return (response.data)
  }*/
  const getAlbums = async () => {

    const response = await instance({
      method: 'get',
      url: 'albums',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    console.log(response.data)
    return (response.data)
  }
  /* const getSongs = async () => {
     const response = await instance({
       method: 'get',
       url: 'tracks',
       headers: {
         Authorization: 'Bearer ' + localStorage.getItem('token')
       }
     })
     console.log(response.data)
     return (response.data)
   }*/
  // tracks.value = await getSongs()
  albums.value = await getAlbums()
  artists.value = await getArtists()

})
const selectAlbum = async (id) => {
  await router.push({
    name: 'album',
    params: {
      album: id
    }
  })
}
const getAlbumsByGenre = (genre) => {
  const arr = ref([])
  for (let idx in albums.value) {
    if (albums.value[idx]['genre'] === genre) {
      arr.value.push(albums.value[idx])
    }
  }

  return arr.value
}
const getSeveralAlbums = (quantity, sort = false) => {
  return sort ? albums.value.sort().slice(0, quantity) : albums.value.slice(0, quantity)
}
const test = (str) => {
  console.log(str)
}
const getAlbumArtists = (album) => {
  let string = ''
  for (let i in album.artists) {
    string += album.artists[i].name + ' '
  }
  return string
}

</script>

<template>
  <router-view name="navigation"/>
  <div class="p-8">
    <button
        type="button"
        class="text-white text-2xl font-semibold hover:underline cursor-pointer"
    >
      Спокойное
    </button>

    <div class="py-1.5 "></div>
    <div class="flex flex-1 items-center w-full overflow-x-auto">
      <HomeCard @click="selectAlbum(album.id)"
                v-for="(album,idx) of getAlbumsByGenre(`Rock'n'roll`)"
                :image="backPath+album.og_image"
                :title="album.title"
                :subTitle="getAlbumArtists(album)"/>
    </div>
  </div>

  <div class="p-8">
    <button
        type="button"
        class="text-white text-2xl font-semibold hover:underline cursor-pointer"
    >
      Рекомендуем
    </button>

    <div class="py-1.5"></div>

    <div class="flex items-center w-full overflow-x-auto">
      <HomeCard @click="selectAlbum(album.id)"
                v-for="(album,idx) of getSeveralAlbums(5,true)"
                :image="backPath+album.og_image"
                :title="album.title"
                :subTitle="getAlbumArtists(album)"/>
    </div>
  </div>

  <div class="p-8">
    <button
        type="button"
        class="text-white text-2xl font-semibold hover:underline cursor-pointer"
    >
      Некоторые из ваших любимых
    </button>

    <div class="py-1.5"></div>

    <div class="flex items-center w-full overflow-x-auto">
      <HomeCard @click="selectAlbum(album.id)"
                v-for="(album,idx) of getSeveralAlbums(5)"
                :image="backPath+album.og_image"
                :title="album.title"
                :subTitle="getAlbumArtists(album)"/>
    </div>
  </div>
</template>
