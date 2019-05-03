<template>
    <div class="container-fluid">
        <div class="row sort">
            <div class="sort-options">
                <h3>{{ $store.state.lang === 'en' ? 'Sorted by' : 'Trié par' }}</h3>
                <p>{{ $store.state.lang === 'en' ? 'Title' : 'Titre' }}</p>
                <el-radio-group v-model="title" size="mini" :disabled="sort_vote_average != 'Aucun' || sort_release_date != 'Aucun'">
                    <el-radio-button label="Aucun">{{ $store.state.lang === 'en' ? 'None' : 'Aucun' }}</el-radio-button>
                    <el-radio-button label="Décroissant">{{ $store.state.lang === 'en' ? 'Descending' : 'Décroissant' }}</el-radio-button>
                    <el-radio-button label="Croissant">{{ $store.state.lang === 'en' ? 'Ascending' : 'Croissant' }}</el-radio-button>
                </el-radio-group>
                <p>{{ $store.state.lang === 'en' ? 'Popularity' : 'Popularité' }}</p>
                <el-radio-group v-model="sort_vote_average" size="mini" :disabled="title != 'Aucun' || sort_release_date != 'Aucun'">
                    <el-radio-button label="Aucun">{{ $store.state.lang === 'en' ? 'None' : 'Aucun' }}</el-radio-button>
                    <el-radio-button label="Décroissant">{{ $store.state.lang === 'en' ? 'Descending' : 'Décroissant' }}</el-radio-button>
                    <el-radio-button label="Croissant">{{ $store.state.lang === 'en' ? 'Ascending' : 'Croissant' }}</el-radio-button>
                </el-radio-group>
                <p>{{ $store.state.lang === 'en' ? 'Release date' : 'Date de sortie' }}</p>
                <el-radio-group v-model="sort_release_date" size="mini" :disabled="sort_vote_average != 'Aucun' || title != 'Aucun'">
                    <el-radio-button label="Aucun">{{ $store.state.lang === 'en' ? 'None' : 'Aucun' }}</el-radio-button>
                    <el-radio-button label="Décroissant">{{ $store.state.lang === 'en' ? 'Descending' : 'Décroissant' }}</el-radio-button>
                    <el-radio-button label="Croissant">{{ $store.state.lang === 'en' ? 'Ascending' : 'Croissant' }}</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="searchedMovies" v-if="!fr_error && !en_error">
            <ul class="search-container list-searchedMovies" >
                <li class="item-searchedMovie" v-for="(movie, index) in movies" :key="`movie-${index}`">
                    <box-figure :movie="movie" :userMovies="userMovies"/>
                </li>
            </ul>
        </div>
        <div class="error" v-else>
            <h3>{{ $store.state.lang === 'en' ? en_error : fr_error }}</h3>
        </div>
    </div>
</template>

<script>
import BoxFigure from '@/components/BoxFigure.vue'

export default {
    components: {
        BoxFigure
    },
    data() {
        return {
            movies: [],
            tmp: [],
            page: 1,
            userMovies: {},
            isSearch: false,

            sort_vote_average: 'Aucun',
            sort_release_date: 'Aucun',
            title: 'Aucun',

            genre: '-1',
            language: 'en',
            disc_vote_average: [0, 10],
            disc_release_date_min: 1980,
            disc_release_date_max: 2018,

            fr_error: '',
            en_error: '',

            index: 0
        }
    },
    watch: {
		'$store.state.search' (n, o) {
            this.page = 1
            this.movies = []
            this.tmp = []
            this.isSearch = this.$store.state.search ? true : false
            this.isSearch ? this.searchMovies() : ''
        },
        title() {
            if (this.title === 'Décroissant') this.movies.sort((a,b) => { return (a.Title > b.Title) ? 1 : ((b.Title > a.Title) ? -1 : 0) })
            else if (this.title === 'Croissant') this.movies.sort((a, b) => { return (a.Title > b.Title) ? -1 : ((b.Title > a.Title) ? 1 : 0) })
            else this.movies = this.tmp.slice(0)
        },
        sort_vote_average() {
            if (this.sort_vote_average === 'Décroissant') this.movies.sort((a, b) => { return b.imdbRating - a.imdbRating })
            else if (this.sort_vote_average === 'Croissant') this.movies.sort((a, b) => { return a.imdbRating - b.imdbRating })
            else this.movies = this.tmp.slice(0)
        },
        sort_release_date() {
            if (this.sort_release_date === 'Décroissant') this.movies.sort((a, b) => { var d1 = new Date(b.Year).getTime(); var d2 = new Date(a.Year).getTime(); return d1 - d2 })
            else if (this.sort_release_date === 'Croissant') this.movies.sort((a, b) => { var d1 = new Date(b.Year).getTime(); var d2 = new Date(a.Year).getTime(); return d2 - d1 })
            else this.movies = this.tmp.slice(0)
        }
	},
    beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
        else if (this.$store.state.search) this.$router.push({name: 'search', query: { q: this.$store.state.search }})
        else this.$router.push({name: 'search'})
    },
    created() {
        if (this.$store.state.session) {
            this.getUser()
            if (this.$route.query && this.$route.query.q) this.$store.state.search = this.$route.query.q
            this.$store.state.search ? this.searchMovies() : ''
            this.isSearch = this.$store.state.search ? true : false
        }
    },
    mounted() {
        this.scroll()
    },
    methods: {
        async searchMovies() {
            var result = await this.$store.dispatch('search', this)
            if (result) {
                if (result.data.success) {
                    this.fr_error = ''
                    this.en_error = ''
                    if (this.page === 1) { this.tmp = []; this.movies = [] }
                    if (result.data.data.movies_infos) { 
                        result.data.data.movies_infos.forEach(movie => {
                            this.tmp.push(movie)
                            this.movies.push(movie)
                        })
                        let cache = {}
                        this.movies = this.movies.filter(element => { return cache[element.imdbID] ? 0 : cache[element.imdbID] = 1 })
                    } else { this.fr_error = 'Aucun torrent pour ce film..'; this.en_error = 'No torrent for this movie..' }
                } else {
                    this.fr_error = result.data.fr_error
                    this.en_error = result.data.en_error
                }
            }
        },
        scroll() {
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                if (bottomOfWindow) if (++this.page <= 3) this.searchMovies()
            };
        },
        async getUser() {
            var result = await this.$store.dispatch('watchedMovie')
            if (result) if (result.data.success) this.userMovies = result.data.data.movies
        }
    }
}
</script>

<style scoped>
.search-container {
    margin-top: 20px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
.search-container:hover {
    cursor: pointer;
}
.searchedMovies {
    margin-top: 58px;
}
.sort {
    text-align: center;
    margin-top: 116px;
}
.sort h3 {
    padding: 15px;
    color: white
}
.searchedMovies h3 {
    text-align: center;
    text-transform: uppercase;
    text-decoration: underline;
    color: gray;
    margin-top: 30px; 
}
.searchedMovies ul {
    display: inline-block;
    width: 100%;
    height: auto;
    padding: 0;
    text-align: center;
	list-style: none;

}
.searchedMovies ul li {
    display: inline-block;
    list-style: none;
    padding: 0;
    margin: 25px 0 25px;
}
.sort p {
    color: white;
    font-size: small;
}
.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #FFF;
    background-color: lightcoral;
    border-color: lightcoral;
    -webkit-box-shadow: -1px 0 0 0 lightcoral;
    box-shadow: -1px 0 0 0 lightcoral;
}
.error h3 {
    color: white;
    text-align: center;
    margin-top: 116px;
}
.sort-options {
    margin: auto;
}
</style>
