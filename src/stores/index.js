import {defineStore} from "pinia";

export const useStore = defineStore('index', {
    state: () => ({
        albums: [],
        users: [],
        tracks: [],
        artists: [],
        genres: [],
        playlists: [],
        elem:{},
        fields:{}

        // moods: "Спокойное","Бодрящее","Грустное","Веселое"
    }),
    actions: {

        isAdmin(parameter) {
            return parameter !== 'playlists'
        },
        getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
        }

    }
})
