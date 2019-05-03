<template>
	<div class="container-fluid">
		<div class="contain">
			<div class="torrents-details" v-if="!loading">
				<h5 class='title'>{{ $store.state.lang === 'en' ? 'Last RARBG\'s torrents' : 'Les derniers torrents RARBG' }}</h5>
				<ul class="recommanded-container list-recommandedMovies" >
					<li class="item-recommandedMovies" v-for="(movie, index) in lastTorrents" :key="`movie-${index}`">
						<box-figure :movie="movie" :userMovies="userMovies"/>
					</li>
				</ul>
				<h5 class='title'>{{ $store.state.lang === 'en' ? 'Top seeders RARBG\'s torrents' : 'Les torrents RARBG avec le plus de seeders' }}</h5>
				<ul class="recommanded-container list-recommandedMovies" >
					<li class="item-recommandedMovies" v-for="(movie, index) in seedersTorrents" :key="`movie-${index}`">
						<box-figure :movie="movie" :userMovies="userMovies"/>
					</li>
				</ul>
				<h5 class='title'>{{ $store.state.lang === 'en' ? 'Top leechers RARBG\'s torrents' : 'Les torrents RARBG avec le plus de leechers' }}</h5>
				<ul class="recommanded-container list-recommandedMovies" >
					<li class="item-recommandedMovies" v-for="(movie, index) in leechersTorrents" :key="`movie-${index}`">
						<box-figure :movie="movie" :userMovies="userMovies"/>
					</li>
				</ul>
			</div>
			<div class="animation" v-else>
				<box-loading/>
			</div>
		</div>
	</div>
</template>

<script>
import BoxFigure from '@/components/BoxFigure.vue'
import BoxLoading from '@/components/BoxLoading.vue'

export default {
	data() {
		return {
			lastTorrents: [],
			seedersTorrents: [],
			leechersTorrents: [],
			loading: true,

			userMovies: {}
		}
	},
	async beforeCreate() {
		if (localStorage.getItem('authenticatedToken')) {
            var result = await this.$store.dispatch('getLogin')
            if (!result || !result.data.success) this.$router.push({ name: 'login' })
		} else this.$router.push({ name: 'login' })
	},
	async created() {
		if (this.$store.state.session) { this.getUser(); this.getMovies() }
	},
	methods: {
		async getMovies() {
			var result = await this.$store.dispatch('recommanded')
			if (result) {
				if (result.data.success) {
					this.loading = false
					let cache = {}
					this.lastTorrents = result.data.data.lastTorrents_infos.filter(element => { return cache[element.imdbID] ? 0 : cache[element.imdbID] = 1 })
					cache = {}
					this.seedersTorrents = result.data.data.seedersTorrents_infos.filter(element => { return cache[element.imdbID] ? 0 : cache[element.imdbID] = 1 })
					cache = {}
					this.leechersTorrents = result.data.data.leechersTorrents_infos.filter(element => { return cache[element.imdbID] ? 0 : cache[element.imdbID] = 1 })
				}
			}
		},
		async getUser() {
            var result = await this.$store.dispatch('watchedMovie')
            if (result) if (result.data.success) this.userMovies = result.data.data.movies
        }
	},
    components: {
		BoxLoading,
		BoxFigure
    }
}
</script>

<style scoped>
.torrents-details {
	margin-top: 58px;
}
.title {
    color: lightcoral;
    padding-top: 60px;
	text-align: center;
}
.view i {
    cursor:pointer;
    color:lightcoral;
}
.el-icon-loading {
    color: lightcoral !important;
}
.el-loading-spinner i {
    color: lightcoral !important;
}
.main {
	text-align: center;
}
.contain {
    text-align: center;
    padding-top: 116px;
    min-height: 600px;
}
@media screen and (max-width:400px){
    .animation .container {
        display: none;
    }
}
.recommanded-container {
    margin-top: 20px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
.recommanded-container:hover {
    cursor: pointer;
}
.torrents-details h3 {
    text-align: center;
    text-transform: uppercase;
    text-decoration: underline;
    color: gray;
    margin-top: 30px; 
}
.torrents-details ul {
    display: inline-block;
    width: 100%;
    height: auto;
    padding: 0;
    text-align: center;
	list-style: none;

}
.torrents-details ul li {
    display: inline-block;
    list-style: none;
    padding: 0;
    margin: 25px 0 25px;
}
</style>


