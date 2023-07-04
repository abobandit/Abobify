<template>
  <div class="bg-black  h-screen w-screen flex flex-col bg-gradient-to-b
            from-[#1C1C1C]
            to-black">
    <div class="px-8 py-3 bg-slate-200 w-fit rounded-xl m-auto">
      <h2 class="text-center  mb-5">Авторизация</h2>
      <form class="flex flex-col items-center relative" @submit.prevent>
        <span class="text-red-600 text-[.8rem] absolute top-[-1.2rem]"  v-show="hasError">Ошибка при заполнении данных</span>

        <input v-model="user.email"
               class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
               placeholder="Введите вашу почту" type="email">
        <input v-model="user.password"
               class="w-min px-1 py-0.5  rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
               placeholder="Введите ваш пароль" type="password">
        <input @click.prevent="logIn()"
               class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white "
               value="Отправить"
               type="button">

      </form>
      <router-link to="/signin" v-if="!isAuth">
        <button
            class="w-full mx-auto p-1 text-center rounded-lg  outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white">
          Регистрация
        </button>
      </router-link>
    </div>

  </div>
</template>

<script setup>
import instance from "../api/auth";
import {ref} from "vue";
import {useUserStore} from "../stores/user";
import {storeToRefs} from "pinia";
import router from "../router";
const user = ref({
  email:'',
  password:'',
})
const hasError = ref(false)
const useUser = useUserStore()
const {isAuth, role, token} = storeToRefs(useUser)
const logIn = async () =>{
  try{
    const request =  await instance({
      method:'post',
      url:'login',
      data:{
        email:user.value.email,
        password:user.value.password
      }
    })
    if (request.data.message === 'User Logged in successfully'){
        isAuth.value = true
        role.value = request.data.role
        token.value = request.data.token
    }else{
      hasError.value = true
    }
    if (isAuth.value === true) {
      localStorage.setItem('token', token.value)
      localStorage.setItem('role', role.value)
      router.push('/home')
    }

  }catch (e){
    hasError.value = true
    console.log(e)
  }

}
</script>

<style scoped>

</style>
