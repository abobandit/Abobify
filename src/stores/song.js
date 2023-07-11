import {defineStore} from 'pinia'
import instance from "../api/auth";
import router from "../router";

export const useSongStore = defineStore('song', {
    state: () => ({
        backPath: 'http://spoti/storage/',
        isPlaying: false,
        audio: null,
        currentArtist: null,
        currentTrack: null,
        currentInstance: {},
        currentResource:{},
        queue: [],
        elem: {
            type: '',
            path: ''
        },
    }),
    actions: {
        async onResourceChanging() {
            let resourcePath

            // Если имя маршрута Альбом то ссылка на картинку берется из значения ресурса, в противном случае из дебрей
            if (router.currentRoute.value.name === 'album') {
                resourcePath = this.currentInstance.og_image
                this.elem['path'] = this.backPath + await resourcePath
            } else {
                try {
                    const frstTrack = this.currentInstance.tracks
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
        async getAlbum( to = router.currentRoute.value) {
            try {
                console.log('Получаем альбом или плейлист' +to.path.substring(1))
                const response = await instance({
                    url: to.path.substring(1),
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                console.log('response.data')
                console.log(response.data)
                const dataTracks = response.data.tracks
                console.log(dataTracks)
                /*else if (to.name === 'playlist' && dataTracks.length){
                    const request = await instance({
                        url: `albums/${dataTracks[0].album_id}`,
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    return property ? request.data.tracks[0] : request.data

                }*/
                return response.data
            } catch (e) {
                console.log(e)
            }
        },
        async getArtist() {
            try {
                console.log('Получаем исполнителя')
                const response = await instance({
                    url: `albums/${this.currentResource.tracks[0].album_id}`, headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                console.log(response.data)
                console.log('Выше был респонс')
                return response.data.artists[0]
            } catch (e) {
                console.log('Не выбран трек')
            }

        },

        /*
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
        async loadSong( track) {
            this.currentArtist = await this.getArtist()
            this.currentTrack = track
            console.log('track from load')
            console.log(track)
            if (router.currentRoute.value.name ==='albums') this.currentTrack.og_image = this.currentResource.og_image
            if (this.audio && this.audio.src) {
                this.audio.pause()
                this.isPlaying = false
                this.audio.src = ''
            }
            console.log( this.currentResource)

            this.audio = new Audio()
            console.log('это аудио')
            console.log(this.audio)
            console.log('это трек')

            console.log(track)
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
//resource doesnt change
        async playOrPauseThisSong(track) {
            console.log('track and artist from playOrPauseThisSong')
            console.log(track )
            this.currentResource = this.currentInstance
            if (!this.audio || !this.audio.src || (this.currentTrack.id !== track.id)) {
                this.queue = this.currentResource.tracks
                await this.loadSong(track)
                return
            }
            this.playOrPauseSong()
        },
        async prevSong(currentTrack) {
            console.log('currentTrack from prevSong')
            console.log(currentTrack )
            if (await this.detectCurrentTrackId(currentTrack) === 0) {
                let track = this.queue[this.queue.length - 1]
                await this.loadSong( track)
                /*console.log('Условие сработало')
                await this.playFromFirst()*/
            } else {
                let track = this.queue[await this.detectCurrentTrackId(currentTrack) - 1]
                await this.loadSong(track)
            }

        },
        //Возвращает трека из this.currentResource
        async detectCurrentTrackId(track) {
            console.log('currentTrack from detectTrack')
            console.log(track )
            return this.queue.indexOf(track)
        },
        // Если трек из this.currentResource  не последний, то запускатеся следующий по очереди трек, в противном случае ресурс проигрывается заново
        async nextSong(currentTrack) {
            console.log('currentTrack from nextSong')
            console.log(currentTrack )
            console.log('queueu from nextSong')

            console.log(this.queue )
            // const artists = this.currentResource.artists || this.currentArtist
                if (await this.detectCurrentTrackId(currentTrack) === this.queue.length - 1) {
                    let track = this.queue[0]
                    await this.loadSong( track)
                    /*console.log('Условие сработало')
                    await this.playFromFirst()*/
                } else {
                    let track = this.queue[await this.detectCurrentTrackId(currentTrack) + 1]
                    await this.loadSong( track)
                }


        },

        async playFromFirst() {
            this.resetState()
            this.currentResource = this.currentInstance
            this.queue = this.currentResource.tracks
            let track = this.queue[0]
            await this.loadSong( track)
            console.log('hello from playFrom first')
        },

        resetState() {
            this.isPlaying = false
            this.audio = null
            this.currentArtist = null
            this.currentTrack = null
        }
    }, persist: true,
})
