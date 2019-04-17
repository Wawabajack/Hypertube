<template>
    <div class="container-fluid">
        <div class="searchedMovies">
            <ul class="search-container list-searchedMovies">
                <div v-for="(movie, index) in movies" :key="`movie-${index}`">
                    <li class="item-searchedMovie" v-for="(mov, ind) in movie" :key="`mov-${ind}`">
                        <box-search :movie="mov" :userMovies="userMovies"/>
                    </li>
                </div>
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
            page: 1,
            userMovies: {}
        }
    },
    watch: {
		'$store.state.search' (n, o) {
            this.page = 1
            this.movies = []
            this.getMoviesList()
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
            var result = await this.$store.dispatch('search', this.page)
            if (result) if (result.data.success) this.movies.push(result.data.data.movies)
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
</style>
