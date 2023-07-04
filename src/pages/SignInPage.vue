<template>
  <div class="bg-black  h-screen w-screen flex flex-col bg-gradient-to-b
            from-[#1C1C1C]
            to-black">
    <div class="px-8 py-3 bg-slate-200 w-fit rounded-xl m-auto">
      <h2 class="text-center  mb-5">Уже авторизованы?</h2>

      <router-link to="/login" v-if="!isAuth">
        <button
            class="w-full mx-auto p-1 text-center rounded-lg  outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white">
          Войти
        </button>
      </router-link>
      <h2 class="text-center  mb-5">Регистрация</h2>
      <form @input="hasError=false" class="flex flex-col items-center relative" @submit.prevent>
        <span class="text-red-600 text-[.8rem] absolute top-[-1rem]"  v-show="hasError">Ошибка при заполнении данных</span>
        <input v-model="user.email"
               class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
               placeholder="Введите вашу почту" type="email">
        <input v-model="user.login"
               class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
               placeholder="Как нам вас называть?" type="text">
        <input v-model="user.first_name"
               class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
               placeholder="Введите ваше имя" type="text">
        <input v-model="user.last_name"
               class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
               placeholder="Введите ваше фамилию" type="text">
        <input v-model="user.password"
               class="w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5"
               placeholder="Введите ваш пароль" type="password">
        <input @click.prevent="signingin()"
               class="justify-self-center w-min px-1 py-0.5 rounded-lg outline-none hover:bg-gray-100 focus:border focus:border-black mb-5 bg-white "
               value="Отправить"
               type="button">

      </form>

    </div>

  </div>

</template>

<script setup>
import {ref} from "vue";
import instance from "../api/auth";
import router from "../router";
import {useUserStore} from "../stores/user";
import {storeToRefs} from "pinia/dist/pinia";
const useUser = useUserStore()
const {isAuth, role, token} = storeToRefs(useUser)
const user = ref({
  email: '',
  login: '',
  first_name: '',
  last_name: '',
  password: '',
})
const hasError = ref(false)
/*const asignUser = async () => {
  const userData = await signingin()
  console.log(userData)
  useUser.changeUserSettings(
      null,
      null,
      userData.login,
      userData.email,
  )
  console.log(userStore)
}
const auth = async() =>{
  await asignUser()
}*/
//Попытка войти
const signingin = async () => {
  try {
    const request = await instance({
      method:'post',
      url:'signin',
      data:{
        first_name: user.value.first_name,
        last_name: user.value.last_name,
        login: user.value.login,
        password: user.value.password,
        email: user.value.email
      }
      })
        // Если пользователь не создался, вылезает ошибка
    return request.data.status !== 'Created'? hasError.value = true: router.push('/login')
  } catch (e) {
    console.log('Не получилось создать пользователя')
  }

}
</script>
