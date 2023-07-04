import {defineStore} from "pinia";

export const useStore = defineStore('index',{
    state: () => ({
        albums: [],
        users: [],
        tracks: [],
        artists: [],
        genres:[],
        playlists:[]
    })
})
