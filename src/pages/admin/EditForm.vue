<template>
  <div @click.self.stop="emits('closeModal')"
       class="fixed bg-black/80 top-0 left-0 w-full h-full flex justify-center items-center">
    <div class="opacity-100 px-8 py-3 bg-slate-200 w-fit rounded-xl m-auto">
      <h3 v-if="isEditing && !isCreating" class="text-center">Внесение изменений в запись для {{ parameter.substring(0, parameter.length - 1) }}
        с id={{ elem.id }}</h3>
      <h3 v-else class="text-center"> Создать {{creating}}</h3>
      <form class="flex flex-col items-center relative" @submit.prevent>
        <template v-if="!isCreating">
        <div v-for="(frst,sec,idx) of elem">
          <span class="hidden">{{ assignValue(obj[`${sec}`], frst) }}</span>

          <div class="min-w-min" v-if="(sec !=='albums' &&
                           sec !== 'tracks' &&
                           sec !=='storage_dir' &&
                           sec !== 'img_url' &&
                           sec !=='og_image' &&
                           sec !=='artists' &&
                           sec !== 'id') && frst!==null">
            <span class="text-wrap ">Новое значение для свойства {{ sec }}: </span>
            <input :placeholder="'Текущее значение: ' + frst"

                   v-model="obj[`${sec}`]"
                   class="w-min px-1 py-0.5 placeholder:text-[.8rem] rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
                   type="text">
          </div>
        </div>

        <input type="button"
               value="Отправить"
               class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white "
               @click="patching(parameter,elem.id,queryString(validateQuery(obj,elem)),isAdmin(parameter))"
        >
        </template>
        <template v-else>
          <div v-for="(value,key) of fields">
            <div class="min-w-min">
              <span class="text-wrap ">{{key}} </span>
              <input v-model="fields[key]"
                     :accept="key==='storage_dir' ? '.mp3' : false"
                     class="w-min px-1 py-0.5 placeholder:text-[.8rem] rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
                     :type="key.substring(key.length-2) === 'id'?
                     'number': key === 'storage_dir' ? 'file' : 'text'">
            </div>
          </div>
          <input type="button"
                 value="Отправить"
                 class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white "
                 @click="patching(parameter,'','',isAdmin(parameter),'post',fields)">

        </template>
        <!--        @click="validateQuery(obj,elem)"-->

        <!--        @click="query(parameter,item.id,queryString(),parameter === 'playlists')"-->

        <!--          @click="patching(controller.parameter,k.id, sec, )">-->

        <!--          разобраться  с патчингом: выяснить откуда брать айди пару ключ значения редактируемого объекта чтобы вставить в функцию патчинг, пока
                  иных методов для патчинга не придумал
                  // делаю форму изменение того или иного свойства, нужно отправлять айди должно быть столько инпутов сколько
                  //заполняется поле-->

      </form>

    </div>

  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, reactive, ref, toRefs, watch} from "vue";
import patchAdmin from "../../api/patchAdmin";
import {storeToRefs} from "pinia";
import {useStore} from "../../stores";
import deleteAdmin from "../../api/deleteAdmin";
/*
onMounted(()=>{
  const {fields} = storeToRefs(useStore())
  console.log(fields.value)

})*/
const obj = ref({})
const file = ref()
const {elem,fields} = storeToRefs(useStore())
const props = defineProps({
  isEditing: Boolean,
  isCreating:Boolean,
  creating:String,
  // id: Number|| String,
  parameter: String,
})
const handleFile = (i) =>{
  if (!(i === 'storage_dir')) return
  file.value = fields[i]
}
const {isEditing, parameter, creating, isCreating} = toRefs(props)
const assignValue = (objKey, value) => {
  objKey = value
}
const validateQuery = (obj, dbValue) => {
  return Object.entries(obj).reduce((acc, [k, v]) =>
      ((v !== null && dbValue[k] !== null) && v !== dbValue[k] && (acc[k] = v), acc), {})
// или
//   Object.fromEntries(Object.entries(obj).filter(n => n[1] !== 'value1'))

}
const isAdmin = (parameter) => {
  return parameter !== 'playlists'
}
const emits = defineEmits(['closeModal'])

const consoling = (obj) => {
  console.log(obj)
}

const queryString = (object) => {
  if (!Object.keys(object).length) return false
  let str = ''
  const arr = Object.keys(object)
  for (let item in object) {
    if (item !== 'id') {
      str += item + '=' + object[item]
      item !== arr[arr.length - 1] ? str += '&' : str
    }
  }
  console.log(str)
  return str
}
const deleting = async (path, id, isAdmin) => {
  try {
    const response = await deleteAdmin({
      url: (isAdmin ? 'admin/' : '') + path + '/' + id
    })
    console.log(response)
    return response
  } catch (e) {
    console.log(e)
  }
}
const patching = async (path, id, string, isAdmin = false,method='get',data='') => {
  if (!string.length && method==='patch') return false
  const put = (JSON.parse(JSON.stringify(data)))
  let formData = new FormData();
  for (let i in data){
    let item = data[i]
    console.log(i)
    if(i === 'storage_dir') item = new File([''],item,{type:"audio/mpeg"})
    console.log(item)
   formData.append(i,data[i])
  }
  // console.log(formData)

  try {
    const response = await patchAdmin({
      method:method,
      url: (isAdmin ? 'admin/' : '') + path + (string !==''?'/' + id + '?' + string: ''),
      data: formData
    })
    console.log(response)
    return response
  } catch (e) {
    console.log(e)
  } finally {
    emits('closeModal')
  }
}

const query = (parameter, id, queryString, isAdmin) => {
  patching(parameter, id, queryString, isAdmin)

}

</script>

<style scoped>

</style>
