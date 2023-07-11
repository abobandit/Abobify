<template>
  <div class="relative left-0 top-[-70px] p-12 pt-[70px] min-h-[340px] w-full bg-[#388890] pointer-events-none ">
    <div id="shadow" class="h-full left-0 absolute top-0 w-full pointer-events-none"></div>
  </div>
  <div class="absolute top-[70px] left-[1rem] ">
    <div class="mb-5">
      <div v-if="!isEditing" class="text-white">
        <h2 class="text-4xl mb-5">Профиль</h2>

        <ul >
          <li>Ваш логин <span>{{ login }}</span></li>
          <li>Ваш email <span>{{ email.email }}</span></li>
          <li>Ваш пароль <span>*****</span></li>

        </ul>
      </div>
      <div v-else class="text-black flex flex-col">
        <h2 class="text-2xl">Редактирование настроек профиля</h2>
        <input :value="login"
               class="w-min px-1 py-0.5 bg-white rounded-lg outline-none hover:bg-gray-100  active:bg-gray-200 mb-2"
               placeholder="Введите ваш новый login" type="text">
        <input :value="email.email"
               class="w-min px-1 py-0.5 bg-white rounded-lg outline-none hover:bg-gray-100 focus:bg-white active:bg-gray-200 mb-2"
               placeholder="Введите ваш новый email" type="email">
        <div class="flex">
          <input :value="password"
                 class="w-min px-1 py-0.5 bg-white mr-2 rounded-lg outline-none hover:bg-gray-100 active:bg-gray-200 mb-2"
                 placeholder="Введите ваш новый password" :type="hasClicked?'text':'password'">

          <!--               @click="hasClicked = !hasClicked" type="button">-->
        </div>

      </div>
    </div>

    <input
        @click="isEditing = !isEditing"
        class="outline-none bg-white rounded-lg text-black px-1 py-0.5 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
        :value="isEditing?'Отправить':'Редактировать'" type="button">
  </div>
  <div class="text-white mb-10">
    <h3 class="text-3xl mb-5"  v-if="queue.length">Текущая очередь</h3>
    <ul class="w-full" v-for="(track, index) in queue" :key="track">
      <SongRow  :track="track" :index="++index"/>
    </ul>
  </div>
  <div class="block w-full text-white">
    <h3 class="text-3xl ml-10 mb-5">Вам понравится</h3>
    <div
        class="flex items-center w-full overflow-x-auto" >
      <HomeCard v-for="item in getAlbumsByGenre('Nu metal')"
                @click="selectAlbum(item.id)"
                :image="backPath + item.og_image"
                :title="item.title"
                :subTitle="item.artists[0].name" >
        <button class="p-1 rounded-full bg-white absolute right-6 top-[8.5rem] hidden hover:visible" @click="playFunc()">
          <Play class="" v-if="!isPlaying" fillColor="#181818" :size="25"/>
          <Pause class="inherit" v-else fillColor="#181818" :size="25"/>
        </button>
      </HomeCard>
    </div>
  <div class="block w-full text-white">
    <h3 class="text-3xl ml-10 mb-5">Рекомендуем</h3>
    <div
        class="flex flex-1 items-center w-full overflow-x-auto" >
      <HomeCard v-for="item in getAlbumsByGenre(`Rock'n'roll`)"
                @click="selectAlbum(item.id)"
                :image="backPath + item.og_image"
                :title="item.title"
                :subTitle="item.artists[0].name" >
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
import {onMounted, ref} from "vue";
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';

import HomeCard from "../components/HomeCard.vue"
import {useSongStore} from "../stores/song";
import SongRow from "../components/SongRow.vue"
import instance from "../api/auth";
import {useStore} from "../stores";
import router from "../router";

const useUser = useUserStore()
const {email, login, password} = storeToRefs(useUser)
const isEditing = ref(false)
const hasClicked = ref(false)

const useSong = useSongStore()
const {backPath,item, title, currentTrack, queue, currentArtist ,currentInstance, isPlaying} = storeToRefs(useSong)
const {albums} = storeToRefs(useStore())
const getAlbumsByGenre = (genre) => {
  const arr = ref([])
  for (let idx in albums.value) {
    if (albums.value[idx]['genre'] === genre) {
      arr.value.push(albums.value[idx])
    }
  }

  return arr.value
}
const selectAlbum = async (id) => {
  await router.push({
    name: 'album',
    params: {
      album: id
    }
  })
}
let isHovered = ref(false)
onMounted(async ()=>{
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
const playFunc = () => {
  if (currentTrack.value) {
    useSong.playOrPauseThisSong(currentArtist.value)
    return
  }
  useSong.playFromFirst()
}

</script>

<style scoped>
#shadow{
  background: -webkit-gradient(linear,left top,left bottom,from(transparent),to(rgba(0,0,0,.45))), rgba(0, 0, 0, .05);
}

</style>
