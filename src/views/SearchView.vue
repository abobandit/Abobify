<script setup>
    import CategorySelect from '../components/CategorySelect.vue';
    import {storeToRefs} from "pinia/dist/pinia";
    import {useStore} from "../stores";
    import {onBeforeMount, onMounted} from "vue";
    import instance from "../api/auth";
    import router from "../router";
    import {useSongStore} from "../stores/song";
    const {albums} = storeToRefs(useStore())
    const {backPath,item, title, currentTrack, queue, currentArtist ,currentInstance, isPlaying} = storeToRefs(useSongStore())
    onBeforeMount(async ()=>{
      albums.value = await getAlbums()
    })
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
    const selectAlbum = async (id) => {
      await router.push({
        name: 'album',
        params: {
          album: id
        }
      })
    }
</script>

<template>
    <div class="p-8">
        <button
            type="button"
            class="text-white text-2xl font-semibold hover:underline cursor-pointer"
        >
            Browse all
        </button>

        <div class="py-1.5"></div>

        <div class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
            <CategorySelect
                v-for="album in albums"
                @click="selectAlbum(album.id)"
                :category="album.title"
                :image="backPath + album.og_image"/>
        </div>
    </div>
</template>
