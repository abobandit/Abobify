<template>
  <div class="mb-4" v-for="(controller,idx) in controllerArray" :key="controller.name">

    <router-link
        :to="{name: controller.parameter}">
      <!--          @click="isClicked[idx] =! isClicked[idx]"-->
      <!--      @click="getData(controller.getter())"-->
      <div @click="isClicked[idx] = !isClicked[idx]"
      >{{ controller.name }}
      </div>
    </router-link>
    <!--        <div>
              <div v-for="dataItem in controller.getter()"
              >
                {{ dataItem }}
                &lt;!&ndash;        <div v-for="(key,value) in dataItem"
                        >{{ key }}{{ value }}</div>&ndash;&gt;
              </div>
            </div>-->
    <router-view v-if="isClicked[idx]" :collectionDB="data[idx]" :parameter="controller.parameter"/>
  </div>
  <!--  <input value="click" type="button" @click="getData($route.name)">-->

  <!--
    <div v-for="(controller,idx) in controllerArray">

    <div v-for="(value,key,idx) of useStore()">

        <input v-if="key === controller.parameter" type="button" :value="controller.name"
               class="bg-blue-400 w-[100%] p-1 "
               @click="isExpanded[idx] =!isExpanded[idx]"
        >
        <div class=" " v-if="isExpanded[idx]">
          <template v-if="key === controller.parameter">
            <div class="grid grid-cols-1 mt-2 sm:grid-cols-2   ">
  &lt;!&ndash;            отправляет PATCH запрос на бэк, по айди долежн изменить элемент &ndash;&gt;
              <input type="button" :value="'Изменить ' + toSingular(controller)+' по id'"
                     @click="isEditing = !isEditing"
                     class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-red-500 mb-2 focus:border focus:border-black bg-blue-400 "
              >
              <div>
                {{value}}
              </div>
              <input type="button" value="Удалить"
                     class="w-min justify-self-center px-1 py-0.5 rounded-lg outline-none hover:bg-red-500 mb-2 focus:border focus:border-black bg-blue-400 "
              >
            </div>
            <div class="mb-4 rounded-xl mx-auto border border-black w-2/3 p-2" v-for="k of value">
              <div class="grid grid-cols-2 justify-items-center mx-auto" v-for="(frst,sec) of k">
                <div class="w-full text-center bg-red-200  border-l-gray-500">{{ frst !== null ? sec : null }}</div>
                <div class="w-full text-center bg-emerald-300 border-r-gray-500">{{ frst }}</div>
  &lt;!&ndash;              <div class="grid grid-cols-2 mt-2   " v-if="frst !== null">
                  <input type="button" value="Изменить"
                         @click="isEditing = !isEditing"
                         class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-red-500 mb-2 focus:border focus:border-black bg-blue-400 "
                  >
              </div>&ndash;&gt;
  &lt;!&ndash;              форма заполнения инпутов&ndash;&gt;
                <div v-if="isEditing" @click.self.stop="isEditing = false" class="fixed bg-black/10 top-0 left-0 w-full h-full flex justify-center items-center">
                  <div class="opacity-100 px-8 py-3 bg-slate-200 w-fit rounded-xl m-auto">

                    <h3 class="text-center">Изменение: {{ controller.title}}</h3>
                    <h3 class="text-center mb-4 text-[.8rem]">с id = {{ k.id}}</h3>
                    <form class="flex flex-col items-center relative" @submit.prevent>
                      <div v-for="(frst,sec,idx) of k">
                        <div class="min-w-min" v-if="sec !== 'id' && frst!==null">
                          <span class="text-wrap ">Новое значение для свойства {{sec}}: </span>
                          <input :placeholder="'Текущее значение: ' + frst"
                                 v-model="fields[idx]"
                                 class="w-min px-1 py-0.5 placeholder:text-[.8rem] rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
                                 type="text">
                        </div>

                      </div>
                      <input type="button"
                             value="Отправить"
                             class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white "
                             @click="query()">
                      &lt;!&ndash;                           @click="patching(controller.parameter,k.id, sec, )">&ndash;&gt;

                      &lt;!&ndash; разобраться  с патчингом: выяснить откуда брать айди пару ключ значения редактируемого объекта чтобы вставить в функцию патчинг, пока
                      иных методов для патчинга не придумал
                        // делаю форму изменение того или иного свойства, нужно отправлять айди должно быть столько инпутов сколько
                                      //заполняется поле&ndash;&gt;

                    </form>

                  </div>

                </div>

                <input type="button" value="Удалить"
                       class="w-full px-1 py-0.5 rounded-lg outline-none hover:bg-red-500 mb-2 focus:border focus:border-black bg-blue-400 "
                >

            </div>
            </div>


          </template>
      </div>



        </div>
        &lt;!&ndash;      getData(value[0].id)&ndash;&gt;
        &lt;!&ndash;      <input v-if="key==='getter'" type="button" value="getter" class="bg-blue-400"
                     @click="getterFuncArray()"
              >&ndash;&gt;
      </div>
  -->


  <!--  <ul >-->


  <!--  </ul>-->

</template>

<script setup>
import {computed, onBeforeMount, onMounted, provide, ref, watch} from "vue";
import ControllerAdmin from './ControllerAdmin.vue'
import adminGetInstance from "../../api/adminGetInstance";
import instance from "../../api/auth";
import {storeToRefs} from "pinia";
import {useStore} from "../../stores";
import patchAdmin from "../../api/patchAdmin";
import router from "../../router";
// админ вводит id трека который хочет изменить или удалить
// const isExpanded = ref([false, false, false, false, false])
/*const controllerData = computed(()=>{
  const newController = controllerArray
    newController.forEach(async item =>{
    try {
      const getterArray = ref([])
      const getterItem= await item.getter()
      getterItem.title = item.title
      getterArray.value.push(await getterItem)
    }catch (e) {
      console.log(e)
    }
  })
  console.log(newController)
  console.log(controllerArray)
})*/
/*const controllerData = computed(()=>{
    return dataa.value.forEach(async item =>{
    try {
      const getterArray = ref([])
      const getterItem ={}
      getterItem.item = await item.getter()
      getterItem.title = item.title
      getterArray.value.push(getterItem)
      item = getterArray
    }catch (e) {
      console.log(e)
    }
  })
})*/
// const isEditing = ref(false)

const isClicked = ref([false, false, false, false, false])
watch(() => isClicked.value, () => {
     return  0 !== isClicked.value.reduce((acc, item) => acc + item)
          ? isClicked.value
          : router.go(-1)
      /*if ()
        router.push({
          name:'admin'
        })*/
    },
    {deep: true})
/*
const queryId = ref()
const consoling = (obj) => {
  console.log(obj)
}
*/

/*

// Из каждого объекта массива достает
// проверяет оставшиеся элементы на пустоту
const checkForEmptiness = (arr) =>{
  for (let i in arr){
    // if (arr.slice(i,arr.length-1))
  }
}
*/

//Вынимает из объекта значения и возвращает массив
/*const openOrClose = (id) =>{

  if (!isClicked.value[id]) )

}*/
const toArray = (values) => {
  const arr = ref([])
  for (let value of values) {
    arr.value.push(value)
  }
  console.log(arr.value)
  return arr.value
}
/*const query = (path, id, keys, values, isAdmin) => {
  patching(path, id, queryString(toArray(keys), toArray(values)), isAdmin)

}*/
const toSingular = (string) => {
  return string.parameter.trim().substring(0, string.parameter.length - 1)
}
const data = ref([])
const currentPage = ref(1)
const limit = 10
const {users} = storeToRefs(useStore())
// const totalPages = Math.ceil(users.value.length / limit)

//
const controllerArray = [
  {
    name: 'Управление плейлистами',
    parameter: 'playlists',
    title: 'Плейлисты',
    getter: async () => {
      try {
        const response = await instance({
          url: 'playlists'
        })
        return await response.data
      } catch (e) {
        console.log(e)
      }

    }
  }, {
    name: 'Управление пользователями',
    parameter: 'users',
    title: 'Пользователи',
    getter: async () => {
      try {
        const response = await adminGetInstance({url: 'users'})
        return await response.data
      } catch (e) {
        console.log(e)
      }

    }
  }, {
    name: 'Управление альбомами',
    parameter: 'albums',
    title: 'Альбомы',
    getter: async () => {
      try {
        const response = await adminGetInstance({url: 'albums'})
        return await response.data
      } catch (e) {
        console.log(e)
      }
    }
  }, {
    name: 'Управление исполнителями',
    parameter: 'artists',
    title: 'Исполнители',
    getter: async () => {
      try {
        const response = await adminGetInstance({url: 'artists'})
        return await response.data
      } catch (e) {
        console.log(e)
      }

    }
  }, {
    name: 'Управление жанрами',
    parameter: 'genres',
    title: 'Жанры',
    getter: async () => {
      try {
        const response = await adminGetInstance({url: 'genres'})
        return await response.data
      } catch (e) {
        console.log(e)
      }
    }
  }, {
    name: 'Управление треками',
    parameter: 'tracks',
    title: 'Треки',
    getter: async () => {
      try {
        const response = await adminGetInstance({url: 'tracks'})
        return await response.data

      } catch (e) {
        console.log(e)
      }
    }
  }
]
//Возвращает массив
onBeforeMount(async () => {
  const {albums, users, tracks, artists, genres, playlists} = storeToRefs(useStore())
  const dataa = ref([])
  for (let item in controllerArray) {
    dataa.value.push(await controllerArray[item].getter())
  }
  /*playlists.value = dataa.value[0]
  users.value = dataa.value[1]
  albums.value = dataa.value[2]
  artists.value = dataa.value[3]
  genres.value = dataa.value[4]
  tracks.value = dataa.value[5]*/
  data.value = dataa.value
})

// const getterArray = getterFuncArray()
const getData = async (controllerFunction) => {
  console.log(await controllerFunction)
}
</script>

<style scoped>

</style>
