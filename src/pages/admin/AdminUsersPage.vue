<template>
  <input type="button"
         @click="createItem()"
         class="justify-self-center bg-blue-200 w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white "
         :value="'Создать '+ creating">
  <div class="grid grid-cols-2 justify-items-center gap-x-32">
    <div class="border w-full mb-2" v-for="(item,i) in collectionDB">


      <template v-if="item">
        <div class="grid grid-cols-2 border" v-for="(value,key,idx) of item" :key="idx">
          <div class="w-1/2 border-r">{{ key }}:</div>
          <div class="w-1/2  ">{{ value }}</div>


        </div>
        <input type="button" value="Изменить"
               @click="edit(item)"
               class="w-full px-1 py-0.5 outline-none hover:bg-gray-100 focus:border focus:border-black bg-white "
        >
        <input type="button" value="Удалить"
               @click="deleting(parameter,collectionDB,i,item.id,useStorage.isAdmin(parameter))"
               class="w-full px-1 py-0.5 rounded-lg outline-none hover:bg-red-500 mb-2 focus:border focus:border-black bg-blue-400 "
        >
      </template>

    </div>
    <template v-if="isEditing">
      <EditForm @closeModal="isEditing=false"
                :parameter="parameter"
                :creating="creating"
                :isCreating="isCreating"
                :isEditing="isEditing"/>
    </template>
  </div>
</template>

<script setup>
import EditForm from "./EditForm.vue"
import {storeToRefs} from "pinia";
import {useStore} from "../../stores";
import {onMounted, ref, toRefs, watch} from "vue";
import deleteAdmin from "../../api/deleteAdmin";
import router from "../../router";
const query = ref({})
const props = defineProps({
  parameter: String,
  collectionDB: Array
})
const {collectionDB, parameter} = toRefs(props)

const isCreating = ref(false)
const assignFields = () =>{
  console.log(fields.value)
  switch (parameter.value){
    case 'playlists': fields.value = {title:'aboba@afsd'}
      break
    case 'albums': fields.value = {title:'aboba@afsd',type:'single',genre:'Jazz',artist_id:'1'}
      break
    case 'users': fields.value = {login:'aboba@afsd', email:'aboba@afsd', first_name:'aboba@afsd',password:'123', last_name:'aboba@afsd', role:''}
      break
    case 'artists': fields.value = {name:''}
      break
    case 'genres': fields.value = {genre:'',mood:''}
      break
    case 'tracks': fields.value = {title:'',storage_dir:'',album_id:''}
      break
  }
}
const createItem = async () =>{
  assignFields()
  isEditing.value = true
  isCreating.value = true
  console.log(JSON.stringify(query))
}
const useStorage = useStore()
const {fields,elem} = storeToRefs(useStorage)

const edit = (item) => {
  isEditing.value = true
  elem.value = item
}
const isEditing = ref(false)
/*const assignValue = (objKey, value) => {
  objKey = value
  return
}*/

onMounted(()=>{
  switch (parameter.value) {
    case 'albums':
      creating.value =  'альбом'
      break
    case 'playlists':
      creating.value =  'плейлист'
      break
    case 'users':
      creating.value =  'пользователя'
      break
    case 'genres':
      creating.value =  'жанр'
      break
    case 'artists':
      creating.value =  'исполнителя'
      break
  }
})
const closeModal = (editing) => {
  editing = false
}
const creating = ref('')
/*watch(()=> parameter.value,()=>{

})*/

const deleting = async (path, item, itemId, id, isAdmin) => {
  try {
    const response = await deleteAdmin({
      url: (isAdmin ? 'admin/' : '') + path + '/' + id
    })
    if (response.data.message) delete item[itemId]
    return response
  } catch (e) {
    console.log(e.message)
  }
}


</script>

<style scoped>

</style>
