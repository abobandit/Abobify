import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        userData: {},
        profileImage: null,
        isAuth: false
    }),
    actions: {
        changeUserSettings(first_name = this.first_name,
                           last_name = this.last_name,
                           login = this.login,
                           email = this.email,
                           profileImage = this.profileImage,
                           token = this.token) {
            this.first_name = first_name || null
            this.last_name = last_name || null
            this.email = email || null
            this.profileImage = profileImage || null
            this.login = login || null
            this.token = token || null
        },
        logout() {
            this.first_name =  null
            this.last_name = null
            this.email =  null
            this.profileImage =  null
            this.login = null
            this.token =  null
            this.role =  null
            this.isAuth =  false
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('role')
        },

    },
    persist:true

})
