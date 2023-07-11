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
import AdminUsersPage from "../pages/admin/AdminUsersPage.vue";
import {useSongStore} from "../stores/song";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: NavigationView,
            name: 'navigation',
            redirect:{name:'home'},
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
                /*{
                    path: '/library',
                    name: 'library',
                    component: LibraryView
                },*/
                {
                    path: '/profile',
                    name: 'profile',
                    component: ProfileView
                },

                {
                    path: '/playlists/:playlist',
                    name: 'playlist',
                    component: PlaylistView,
                    beforeEnter: (to,from) =>{
                        // console.log('aboab')
                    }
                },

                {
                    path: '/albums/:album',
                    name: 'album',
                    component: PlaylistView,
                    beforeEnter: (to,from) =>{
                        // console.log('aboab')
                    }
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
            name: 'admin',
            component: MainAdminPage,
            beforeEnter: async (to, from, next) => {
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
                        component: AdminUsersPage,
                        name: 'playlists'
                    },
                    {
                        path: 'users',
                        component: AdminUsersPage,
                        name: 'users'
                    },
                    {
                        path: 'artists',
                        component: AdminUsersPage,
                        name: 'artists'
                    },
                    {
                        path: 'albums',
                        component: AdminUsersPage,
                        name: 'albums'
                    },
                    {
                        path: 'genres',
                        component: AdminUsersPage,
                        name: 'genres'
                    },
                    {
                        path: 'tracks',
                        component: AdminUsersPage,
                        name: 'tracks'
                    },
                ]

        }
    ]
})
router.afterEach(async(to,from)=>{
    if(to.name === 'playlist' || to.name === 'album' || to.name === 'songs'){
        console.log('resourceChanging')
        await useSongStore().onResourceChanging()
    }
})
router.beforeResolve(async (to,from)=>{
    const {currentInstance,elem} = storeToRefs(useSongStore())
    if(to.name === 'playlist' || to.name === 'album' || to.name === 'songs'){
        // console.log(await useSongStore().getAlbum(null,to))
        currentInstance.value = await useSongStore().getAlbum(to)
        console.log('currentInstance')
        console.log(currentInstance.value)
        to.name ==='playlist'? elem.value['type'] = 'Плейлист' : elem.value['type'] = 'Альбом'
    }
})
export default router
