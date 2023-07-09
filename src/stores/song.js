import {defineStore} from 'pinia'
import instance from "../api/auth";
import router from "../router";
import {storeToRefs} from "pinia/dist/pinia";

export const useSongStore = defineStore('song', {
    state: () => ({
        backPath: 'http://spoti/storage/',
        isPlaying: false,
        audio: null,
        currentArtist: null,
        currentTrack: null,
        currentResource: {},
        queue: [],
        elem: {
            type: '',
            path: ''
        },
    }),
    actions: {
        async onResourceChanging() {
            let resourcePath
            console.log(router.currentRoute.value)

            // Если имя маршрута Альбом то ссылка на картинку берется из значения ресурса, в противном случае из дебрей
            if (router.currentRoute.value.name === 'album') {
                resourcePath = await this.currentResource.og_image
                this.elem['path'] = this.backPath + await resourcePath
            } else {
                try {
                    const frstTrack = this.currentResource.tracks
                    if (frstTrack.length){
                        resourcePath = (await instance({
                            url: `albums/${frstTrack[0].album_id}`,
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })).data.og_image
                        this.elem['path'] = this.backPath + await resourcePath

                    }else this.elem['path'] = ''

                } catch {
                    this.elem['path'] = false
                }
                // console.log(resourcePath)

            }
        },
        async getAlbum(property = null, to = router.currentRoute.value) {
            try {
                console.log('Получаем альбом ' +to.path.substring(1))
                const response = await instance({
                    url: to.path.substring(1),
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                const dataTracks = response.data.tracks.length
                if (to.name === 'album') {


                    // console.log(response.data?.[property])
                    console.log('пришел респонс')
                    console.log(response.data)
                    return property ? response.data[property] : response.data
                }else if (to.name === 'playlist' && dataTracks){
                    const request = await instance({
                        url: `albums/${await response.data.tracks[0].album_id}`,
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    return property ? request.data.tracks[0] : request.data

                }
            } catch (e) {
                console.log(e)
            }
        },
        /*async getArtist() {
            try {
                console.log('Получаем исполнителя' + router.currentRoute.value.path)
                const response = await instance({
                    url: router.currentRoute.value.path.substring(1), headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                return response.data.artists[0]
            } catch (e) {
                console.log('Не выбран трек')
            }

        },
        async getAlbumByTrack() {
            try {
                const response = await instance({
                    url: router.currentRoute.value.path.substring(1), headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                console.log('Получаем исполнителя' + router.currentRoute.value.path)
                return response.data.og_image
            } catch (e) {
                console.log('Не выбран трек')
            }

        },*/
        async loadSong(artist, track) {
            this.currentArtist = artist
            this.currentTrack = track
            console.log(this)
            this.currentTrack.og_image = await this.getAlbum('og_image')
            if (this.audio && this.audio.src) {
                this.audio.pause()
                this.isPlaying = false
                this.audio.src = ''
            }
            this.audio = new Audio()
            this.audio.src = this.backPath + track.storage_dir
            setTimeout(() => {
                this.isPlaying = true
                this.audio.play()
            }, 200)
        },

        playOrPauseSong() {
            if (this.audio.paused) {
                this.isPlaying = true
                this.audio.play()
            } else {
                this.isPlaying = false
                this.audio.pause()
            }
        },

        async playOrPauseThisSong(artist, track) {
            if (!this.audio || !this.audio.src || (this.currentTrack.id !== track.id)) {
                this.queue = this.currentResource.tracks
                await this.loadSong(artist, track)
                return
            }
            this.playOrPauseSong()
        },
        async prevSong(currentTrack) {
            if (await this.detectCurrentTrackId(currentTrack) === 0) {
                let track = this.queue[this.queue.length - 1]
                await this.loadSong((await this.getAlbum('artists'))[0], track)
                /*console.log('Условие сработало')
                await this.playFromFirst()*/
            } else {
                let track = this.queue[await this.detectCurrentTrackId(currentTrack) - 1]
                await this.loadSong((await this.getAlbum('artists'))[0], track)
            }

        },
        //Возвращает трека из this.currentResource
        async detectCurrentTrackId(track) {
            return this.queue.indexOf(track)
        },
        // Если трек из this.currentResource  не последний, то запускатеся следующий по очереди трек, в противном случае ресурс проигрывается заново
        async nextSong(currentTrack) {
            if (await this.detectCurrentTrackId(currentTrack) === this.queue.length - 1) {
                let track = this.queue[0]
                await this.loadSong((await this.getAlbum('artists'))[0], track)
                /*console.log('Условие сработало')
                await this.playFromFirst()*/
            } else {
                let track = this.queue[await this.detectCurrentTrackId(currentTrack) + 1]
                await this.loadSong((await this.getAlbum('artists'))[0], track)
            }
        },

        async playFromFirst() {
            this.resetState()
            let track = this.queue[0]
            await this.loadSong((await this.getAlbum('artists'))[0], track)
        },

        resetState() {
            this.isPlaying = false
            this.audio = null
            this.currentArtist = null
            this.currentTrack = null
        }
    }, persist: true,
})
