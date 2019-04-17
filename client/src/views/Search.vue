<template>
    <div class="container-fluid">
        <div class="row sort">
            <div class="offset-md-1 col-md-4 sort-options">
                <h3>{{ $store.state.lang === 'en' ? 'Sorted by' : 'Triée par' }}</h3>
                <p>{{ $store.state.lang === 'en' ? 'Title' : 'Titre' }}</p>
                <el-radio-group v-model="title" size="mini" :disabled="vote_average != 'Aucun' || date_release != 'Aucun'">
                    <el-radio-button :label="$store.state.lang === 'en' ? 'None' : 'Aucun'"></el-radio-button>
                    <el-radio-button :label="$store.state.lang === 'en' ? 'Descending' : 'Décroissant'"></el-radio-button>
                    <el-radio-button :label="$store.state.lang === 'en' ? 'Ascending' : 'Croissant'"></el-radio-button>
                </el-radio-group>
                <p>{{ $store.state.lang === 'en' ? 'Popularity' : 'Popularité' }}</p>
                <el-radio-group v-model="vote_average" size="mini" :disabled="title != 'Aucun' || date_release != 'Aucun'">
                    <el-radio-button :label="$store.state.lang === 'en' ? 'None' : 'Aucun'"></el-radio-button>
                    <el-radio-button :label="$store.state.lang === 'en' ? 'Descending' : 'Décroissant'"></el-radio-button>
                    <el-radio-button :label="$store.state.lang === 'en' ? 'Ascending' : 'Croissant'"></el-radio-button>
                </el-radio-group>
                <p>{{ $store.state.lang === 'en' ? 'Release date' : 'Date de sortie' }}</p>
                <el-radio-group v-model="date_release" size="mini" :disabled="vote_average != 'Aucun' || title != 'Aucun'">
                    <el-radio-button :label="$store.state.lang === 'en' ? 'None' : 'Aucun'"></el-radio-button>
                    <el-radio-button :label="$store.state.lang === 'en' ? 'Descending' : 'Décroissant'"></el-radio-button>
                    <el-radio-button :label="$store.state.lang === 'en' ? 'Ascending' : 'Croissant'"></el-radio-button>
                </el-radio-group>
            </div>
            <div class="col-md-7 sort-request">
                <h3>Request By</h3>
            </div>
        </div>
        <div class="searchedMovies">
            <ul class="search-container list-searchedMovies">
                <li class="item-searchedMovie" v-for="(movie, index) in movies" :key="`mov-${index}`">
                    <box-search :movie="movie" :userMovies="userMovies"/>
                </li>
            </ul>
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

            vote_average: 'Aucun',
            date_release: 'Aucun',
            title: 'Aucun'
        }
    },
    watch: {
		'$store.state.search' (n, o) {
            this.page = 1
            this.movies = []
            this.tmp = []
            this.getMoviesList()
        },
        title() {
            if (this.title === 'Décroissant') this.movies.sort((a,b) => { return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0) })
            else if (this.title === 'Croissant') this.movies.sort((a, b) => { return (a.title > b.title) ? -1 : ((b.title > a.title) ? 1 : 0) })
            else this.movies = this.tmp.slice(0)
        },
        vote_average() {
            if (this.vote_average === 'Décroissant') this.movies.sort((a, b) => { return b.vote_average - a.vote_average })
            else if (this.vote_average === 'Croissant') this.movies.sort((a, b) => { return a.vote_average - b.vote_average })
            else this.movies = this.tmp.slice(0)
        },
        date_release() {
            if (this.date_release === 'Décroissant') this.movies.sort((a, b) => { var d1 = new Date(b.release_date).getTime(); var d2 = new Date(a.release_date).getTime(); return d1 - d2 })
            else if (this.date_release === 'Croissant') this.movies.sort((a, b) => { var d1 = new Date(b.release_date).getTime(); var d2 = new Date(a.release_date).getTime(); return d2 - d1 })
            else this.movies = this.tmp.slice(0)
        }
	},
    beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
    },
    created() {
        this.getUser()
        if (this.$store.state.search) this.getMoviesList()
    },
    mounted() {
        this.scroll()
    },
    methods: {
        async getMoviesList() {
            var result = await this.$store.dispatch('search', this)
            if (result) if (result.data.success) {
                result.data.data.movies.forEach(movie => {
                    this.tmp.push(movie)
                    this.movies.push(movie)
                });
            }
        },
        scroll() {
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                if (bottomOfWindow) { this.page++; this.getMoviesList()}
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
</style>
