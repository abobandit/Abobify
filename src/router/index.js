import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import LibraryView from '../views/LibraryView.vue'
import ProfileView from '../views/ProfileView.vue'
import SignInPage from "../pages/SignInPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import PlaylistView from "../views/PlaylistView.vue";
import MainAdminPage from "../pages/admin/MainAdminPage.vue"
import ControllerAdminPage from "../pages/admin/ControllerAdmin.vue"
import NavigationView from "../views/NavigationView.vue";
import {storeToRefs} from "pinia";
import {useUserStore} from "../stores/user";
import instance from "../api/auth";
import {useStore} from "../stores";
import {ref} from "vue";
import adminGetInstance from "../api/adminGetInstance";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: NavigationView,
            name: 'navigation',
            beforeEnter: async (to, from, next) => {

                const {isAuth} = storeToRefs(useUserStore())

                if (!isAuth.value && to.meta.requiresAuth) next({name: "Log"});
                else next()
            },
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/home',
                    component: HomeView,
                    name: 'home'
                },
                {
                    path: '/search',
                    name: 'search',
                    component: SearchView
                },
                {
                    path: '/library',
                    name: 'library',
                    component: LibraryView
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: ProfileView
                },

                {
                    path: '/playlists/:playlist',
                    name: 'playlist',
                    component: PlaylistView
                },
            ]
        },
        {
            path: '/signin',
            component: SignInPage,
            name: 'Sign',
            beforeEnter: async (to, from, next) => {

                const {isAuth} = storeToRefs(useUserStore())

                if (isAuth.value && !to.meta.requiresAuth) next({name: "home"});
                else next()
            },
        },
        {
            path: '/login',
            component: LoginPage,
            name: 'Log',
            beforeEnter: async (to, from, next) => {

                const {isAuth} = storeToRefs(useUserStore())

                if (isAuth.value && !to.meta.requiresAuth) next({name: "home"});
                else next()
            },
        },
        {
            path: "/admin",
            component: MainAdminPage,
            beforeEnter: async (to, from, next) => {
                /*const {albums, users, tracks, artists, genres, playlists} = storeToRefs(useStore())
                let cool = ref(false)
                do {
                    try{
                        playlists.value = await adminGetInstance({url: 'playlists'}).data
                        users.value = await adminGetInstance({url: 'users'}).data
                        albums.value = await adminGetInstance({url: 'albums'}).data
                        artists.value = await adminGetInstance({url: 'artists'}).data
                        genres.value = await adminGetInstance({url: 'genres'}).data
                        tracks.value = await adminGetInstance({url: 'tracks'}).data
                        cool.value = true
                    }catch (e){
                        cool.value = false
                    }
                }while(!cool)*/
                const {isAuth, role} = storeToRefs(useUserStore())
                if (!isAuth.value && to.meta.requiresAuth && role !== 'admin') next({name: "home"});
                else next()
            },
            props: true,
            meta: {
                requiresAuth: true
            },
            children:
                [
                    {
                        path: 'playlists',
                        component: ControllerAdminPage,
                        name: 'playlists'
                    },
                    {
                        path: 'users',
                        component: ControllerAdminPage,
                        name: 'userss'
                    },
                    {
                        path: 'artists',
                        component: ControllerAdminPage,
                        name: 'artists'
                    },
                    {
                        path: 'albums',
                        component: ControllerAdminPage,
                        name: 'albums'
                    },
                    {
                        path: 'genres',
                        component: ControllerAdminPage,
                        name: 'genres'
                    },
                    {
                        path: 'tracks',
                        component: ControllerAdminPage,
                        name: 'tracks'
                    },
                ]

        }
    ]
})

export default router
