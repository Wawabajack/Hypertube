<template>
	<router-link tag="div" :to="{ name: 'movie', query : { tmp: movie.id, name: sansAccent(movie.original_title), release: movie.release_date.split('-')[0] } }">
		<figure class="search-item">
			<i v-if="watched" class="el-icon-view"></i>
			<img :alt="movie.original_title" :src="movie.poster_path ? 'https://image.tmdb.org/t/p/original/' + movie.poster_path : '/img/notfound.png'"/>
			<figcaption>
				<h4>{{ movie.original_title }}</h4>
				<p v-if="movie.vote_average" class="rating"><i class="icon el-icon-star-on"></i>  {{ movie.vote_average }} <span>/10</span></p>
				<p v-if="movie.overview">{{ movie.overview.substr(0, 150) }} (...)</p>
				<p v-if="movie.release_date" class="year">{{ movie.release_date }}</p>
			</figcaption>
		</figure>
	</router-link>
</template>

<script>
export default {
	props: ['movie', 'userMovies'],
	data() {
    return {
      watched: false
    }
	},
	watch: {
		'movie' (n) {
			this.watched = false
			if (this.userMovies) if (this.userMovies.indexOf(this.movie.id.toString()) >= 0) this.watched = true
		}
	},
	created() {
		if (this.userMovies) if (this.userMovies.indexOf(this.movie.id.toString()) >= 0) this.watched = true
	},
	methods: {
		sansAccent (str) {
			var accent = [
					/[\300-\306]/g, /[\340-\346]/g, // A, a
					/[\310-\313]/g, /[\350-\353]/g, // E, e
					/[\314-\317]/g, /[\354-\357]/g, // I, i
					/[\322-\330]/g, /[\362-\370]/g, // O, o
					/[\331-\334]/g, /[\371-\374]/g, // U, u
					/[\321]/g, /[\361]/g, // N, n
					/[\307]/g, /[\347]/g, // C, c
			]
			var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
			for (var i = 0; i < accent.length; i++) { str = str.replace(accent[i], noaccent[i]) }	
			return str
		}
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
