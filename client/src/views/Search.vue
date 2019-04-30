<template>
    <div class="container-fluid">
        <div class="row sort">
            <div class="offset-md-1 col-md-4 sort-options">
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
            <div class="col-md-6 sort-request">
                <h3>{{ $store.state.lang === 'en' ? 'Request By' : 'Films par'}}</h3>
                <p>Genre</p>
                <el-radio-group v-model="genre" size="mini" :disabled="isSearch">
                    <el-radio-button label="-1">{{ $store.state.lang === 'en' ? 'All' : 'Tous' }}</el-radio-button>
                    <el-radio-button label="28">Action</el-radio-button>
                    <el-radio-button label="12">{{ $store.state.lang === 'en' ? 'Adventure' : 'Aventure' }}</el-radio-button>
                    <el-radio-button label="16">Animation</el-radio-button>
                    <el-radio-button label="35">{{ $store.state.lang === 'en' ? 'Comedy' : 'Comédie' }}</el-radio-button>
                    <el-radio-button label="80">Crime</el-radio-button>
                    <el-radio-button label="99">{{ $store.state.lang === 'en' ? 'Documentary' : 'Documentaire' }}</el-radio-button>
                    <el-radio-button label="18">{{ $store.state.lang === 'en' ? 'Drama' : 'Drame' }}</el-radio-button>
                    <el-radio-button label="10751">{{ $store.state.lang === 'en' ? 'Family' : 'Famille' }}</el-radio-button>
                    <el-radio-button label="14">{{ $store.state.lang === 'en' ? 'Fantasy' : 'Fantastique' }}</el-radio-button>
                    <el-radio-button label="27">{{ $store.state.lang === 'en' ? 'Horror' : 'Horreur' }}</el-radio-button>
                    <el-radio-button label="10749">Romance</el-radio-button>
                    <el-radio-button label="878">Science Fiction</el-radio-button>
                    <el-radio-button label="53">Thriller</el-radio-button>
                    <el-radio-button label="10752">{{ $store.state.lang === 'en' ? 'War' : 'Guerre' }}</el-radio-button>
                    <el-radio-button label="37">Western</el-radio-button>
                </el-radio-group>
                <p>{{ $store.state.lang === 'en' ? 'Popularity' : 'Popularité' }}</p>
                <el-slider
                v-model="disc_vote_average"
                range
                :max="10" :disabled="isSearch">
                </el-slider>
                <p>{{ $store.state.lang === 'en' ? 'Release date' : 'Date de sortie' }}</p>
                <el-input-number size="mini" v-model="disc_release_date_min" :min="1950" :max="disc_release_date_max" @change="reset_andGetRcmdd()" :disabled="isSearch"></el-input-number>
                <el-input-number size="mini" v-model="disc_release_date_max" :min="disc_release_date_min" :max="2019" @change="reset_andGetRcmdd()" :disabled="isSearch"></el-input-number>
            </div>
        </div>
        <div class="searchedMovies" v-if="!fr_error && !en_error">
            <ul class="search-container list-searchedMovies" >
                <li class="item-searchedMovie" v-for="(movie, index) in movies" :key="`movie-${index}`">
                    <box-search :movie="movie" :userMovies="userMovies"/>
                </li>
            </ul>
        </div>
        <div class="error" v-else>
            <h3>{{ $store.state.lang === 'en' ? en_error : fr_error }}</h3>
        </div>
    </div>
</template>

<script>
import BoxSearch from '@/components/BoxSearch.vue'

export default {
    components: {
        BoxSearch
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
            this.$store.state.search ? this.isSearch = true : this.isSearch = false
            this.isSearch ? this.searchMovies() : this.recommandedMovies()
        },
        '$store.state.lang' (n, o) {
            this.page = 1
            this.movies = []
            this.tmp = []
            this.isSearch ? this.searchMovies() : this.recommandedMovies()
        },
        title() {
            if (this.title === 'Décroissant') this.movies.sort((a,b) => { return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0) })
            else if (this.title === 'Croissant') this.movies.sort((a, b) => { return (a.title > b.title) ? -1 : ((b.title > a.title) ? 1 : 0) })
            else this.movies = this.tmp.slice(0)
        },
        sort_vote_average() {
            if (this.sort_vote_average === 'Décroissant') this.movies.sort((a, b) => { return b.vote_average - a.vote_average })
            else if (this.sort_vote_average === 'Croissant') this.movies.sort((a, b) => { return a.vote_average - b.vote_average })
            else this.movies = this.tmp.slice(0)
        },
        sort_release_date() {
            if (this.sort_release_date === 'Décroissant') this.movies.sort((a, b) => { var d1 = new Date(b.release_date).getTime(); var d2 = new Date(a.release_date).getTime(); return d1 - d2 })
            else if (this.sort_release_date === 'Croissant') this.movies.sort((a, b) => { var d1 = new Date(b.release_date).getTime(); var d2 = new Date(a.release_date).getTime(); return d2 - d1 })
            else this.movies = this.tmp.slice(0)
        },
        genre() {
            this.reset_andGetRcmdd()
        },
        language() {
            this.reset_andGetRcmdd()
        },
        disc_vote_average() {
            if (this.index >= 2) this.reset_andGetRcmdd()
            this.index++
        }
	},
    beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
        else if (this.$store.state.search) this.$router.push({name: 'search', query: { q: this.$store.state.search }})
        else this.$router.push({name: 'search'})
    },
    created() {
        this.getUser()
        if (this.$route.query && this.$route.query.q) this.$store.state.search = this.$route.query.q
        this.$store.state.search ? this.searchMovies() : this.reset_andGetRcmdd()
        this.$store.state.search ? this.isSearch = true : this.isSearch = false
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
                    if (this.page === 1) { this.tmp = [], this.movies = [] }
                    result.data.data.movies.forEach(movie => {
                        this.tmp.push(movie)
                        this.movies.push(movie)
                    });
                } else {
                    this.fr_error = result.data.fr_error
                    this.en_error = result.data.en_error
                }
            }
        },
        async recommandedMovies() {
            var result = await this.$store.dispatch('discover', this)
            if (result) {
                if (result.data.success) {
                    this.fr_error = ''
                    this.en_error = ''
                    result.data.data.movies.forEach(movie => {
                        this.tmp.push(movie)
                        this.movies.push(movie)
                    });
                } else {
                    this.en_error = result.data.en_error
                    this.fr_error = result.data.fr_error
                }
            }
        },
        reset_andGetRcmdd() {
            this.tmp = []
            this.movies = []
            this.recommandedMovies()
        },
        scroll() {
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                if (bottomOfWindow) { this.page++; this.$store.state.search ? this.searchMovies() : this.recommandedMovies() }
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
</style>
