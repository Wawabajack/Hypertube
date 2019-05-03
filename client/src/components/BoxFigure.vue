<template>
	<router-link tag="div" :to="{ name: 'movie', query : { id: movie.imdbID } }">
		<figure class="search-item">
			<i v-if="watched" class="el-icon-view"></i>
			<img :alt="movie.Title" :src="!movie.Poster || movie.Poster === 'N/A' ? '/img/notfound.png' : movie.Poster" :onerror="imgError()"/>
			<figcaption>
				<h4>{{ movie.Title }}</h4>
				<p v-if="movie.imdbRating" class="rating"><i class="icon el-icon-star-on"></i>  {{ movie.imdbRating }} <span>/10</span></p>
				<p v-if="movie.Plot">{{ $store.state.lang === 'en' ? movie.Plot.substr(0, 125) : fr_plot.substr(0, 125) }} (...)</p>
				<p v-if="movie.Released" class="year">{{ movie.Released }}</p>
			</figcaption>
		</figure>
	</router-link>
</template>

<script>
import translate from 'translate'
translate.engine = 'google'
translate.key = 'AIzaSyAECIfL6JoLrIcSGjsWHtONieQdXbcwLhI'

export default {
	props: ['movie', 'userMovies'],
	data() {
        return {
            watched: false,

            fr_plot: ''
        }
	},
	watch: {
		'movie' (n) {
            this.watched = false
			if (this.userMovies) if (this.userMovies.indexOf(this.movie.imdbID.toString()) >= 0) this.watched = true
        }
	},
	async created() {
		if (this.$store.state.session) {
			if (this.userMovies) if (this.userMovies.indexOf(this.movie.imdbID.toString()) >= 0) this.watched = true
			translate(this.movie.Plot, { from: 'en', to: 'fr' }).then(res => { this.fr_plot = res })
		}
	},
	methods: {
		imgError() { this.movie.Poster === '/img/notfound.png' }
	}
}
</script>

<style scoped>
body {
	margin:0;
}
figure {
	margin: 0;
	padding: 0;
	height: 365px;
	position: relative;
	display: block;
	cursor: pointer;
	overflow: hidden;
	border: 2px solid #fff;
}
figure:hover figcaption {
	opacity: 1;
	top: 0;
}
figcaption {
	opacity: 0;
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(240,128,128,.3);
	color: #fff;
	-webkit-transition: all .9s ease;
	-moz-transition: all .9s ease;
	-o-transition: all .9s ease;
	-ms-transition: all .9s ease;
	transition: all .9s ease;
	text-align: center;
}
figure img {
	-webkit-transition: all 1.5s;
	-moz-transition: all 1.5s;
	-o-transition: all 1.5s;
	-ms-transition: all 1.5s;
	transition: all 1.5s;
	height: 365px;
    max-width: 285px;
}
figure:hover img {
	-webkit-transform: scale(1.1);
	-moz-transform: scale(1.1);
	-o-transform: scale(1.1);
	-ms-transform: scale(1.1);
	transform: scale(1.1);
}
figcaption h4 {
	font-family: 'Open sans';
	font-weight: 400;
	padding: 10px 20px;
	margin-bottom: 0;
	position: relative;
    font-size: 30px;
    top: 12%;
    color: white !important;
}
figcaption p {
	font-family: 'Open sans';
	padding: 10px 20px;
	margin-bottom: 0;
	margin-top: 20px;
	position: relative;
	top: 12%;
	font-size: 13px;
}
figure:hover h4,figure:hover p {
	left: 0;
}
figcaption a {
	color: #fff;
	border: 2px solid #fff;
	padding: 4px 10px;
	text-decoration: none;
}
figcaption a:hover {
	color: #4f5856;
	background: #fff;
}
figcaption input[type=submit] {
	margin-top: 80px;
	color: #FFF;
	border: solid 1px #CCC;
	background: gray;
}
.search-item {
    border-radius: 5px;
    border: 2px solid lightcoral;
    width: 300px;
    overflow: hidden;
		margin-right: 8px;
    box-shadow: 0 12px 15px rgba(240, 128, 128, 0.21);
}
.search-item .item-name {
    padding: 8px 20px 2px;
}
.search-item .item-desc {
    padding: 0 15px 10px 15px;
    font-size: 14px;
    color: #a3a3a3;
}
.search-item .img-item {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    display: block;
}
.rating i {
    color: lightcoral;
}
.rating span {
    font-size: xx-small;
}
.el-icon-view {
	position: absolute;
	font-size: x-large;
	color: lightcoral;
	left: 5px;
	z-index: 1;
}
</style>
