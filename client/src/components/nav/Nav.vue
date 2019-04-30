<template>
	<header>
		<nav class="navbar">
			<div class="container-fluid">
				<div class="nav-search d-md-inline-block d-lg-inline-block">
					<span class='title'>Hypertube</span>
                </div>
				<div class="nav-icon">
                    <div class="nav-element">
                        <div class="searchBox">
                            <button class="searchTab" tabindex="0" aria-label="Search" @click="collapse()" v-show='isCollapsed'><i class="icon el-icon-search" :class="{active: active === 'search'}"></i></button>
                            <div class="searchInput" v-if='!isCollapsed'>
                                <i style="color:lightcoral" class="icon el-icon-search"></i>
                                <input autofocus type="search" placeholder="title..." maxlength="80" v-model="search" @blur="collapse()">
                            </div>
                        </div>
                    </div>
					<router-link tag="i" :to="{ name: 'home'}"  class="icon el-icon-star-off" :class="{active: active === 'home' || active === null}"></router-link>
					<router-link tag="i" :to="{ name: 'search'}"  class="icon el-icon-view" :class="{active: active === 'search'}"></router-link>
					<router-link tag="i" :to="{ name: 'account'}" class="icon el-icon-setting" :class="{active: active === 'account'}"></router-link>
					<router-link tag="i" :to="{ name: 'disconnect'}" class="icon el-icon-close"></router-link>
                    <img v-if="$store.state.lang === 'en'" src="/img/france-flag-round-icon-16.png" alt="fr" @click="changeLang('fr')">
                    <img v-else src="/img/united-states-of-america-flag-round-icon-16.png" alt="en" @click="changeLang('en')">
				</div>
			</div>
		</nav>
	</header>
</template>

<script>
    export default {
		name: "Nav",
		data() {
			return {
				active: undefined,
                search: '',
                isCollapsed: true,
                lang: ''
			}
		},
		mounted() {
            this.active = this.$route.name
            if (this.active === 'search' && this.$route.query && this.$route.query.q) {
                this.$store.state.search = this.$route.query.q
                this.search = this.$route.query.q
            } else this.search = ''
		},
		watch: {
			'$route' (to, from) {
                this.active = to.name
                if (this.active === 'search' && to.query && to.query.q) {
                    this.$store.state.search = to.query.q
                    this.search = to.query.q
                }
			},
			'search' (n, o) {
                this.$store.state.search = this.sansAccent(this.search)
                this.search ? this.$router.push({name: 'search', query: { q: this.sansAccent(this.search) }}) : this.$router.push({name: 'search' })
			},
		},
		methods: {
            collapse() {
                this.isCollapsed = !this.isCollapsed
            },
            async changeLang(lang) {
                this.lang = lang
                var result = await this.$store.dispatch('lang', this)
            },
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
@font-face {
    font-family: 'underworld';
    src: url('/font/underworld.ttf');
}
@font-face {
    font-family: 'CANDY';
    src: url('/font/CANDY.otf');
}
@font-face {
    font-family: 'Pasajero';
    src: url('/font/Pasajero.otf');
}
@font-face {
    font-family: 'Diamond Dust';
    src: url('/font/Diamond Dust.ttf');
}

span {
    cursor: pointer;
}
.title {
    color:lightcoral;
    font-family: Pasajero;
    font-size: x-large;
    cursor: default
}
.navbar[data-v-1e7cd692] {
    width: 100%;
    height: 58px;
    border-bottom: 1px solid lightcoral;
    position: fixed;
    top: 0;
    background: #141414;
    z-index: 1999;
}
.nav-search {
    color: #bebebe;
    width: 30%;
}
.nav-search .icon {
    margin-right: 15px;
    font-size: 14px;
}
.nav-search input {
    border: none;
    color: #bebebe;
    width: 80%;
}
.nav-search input::placeholder {
    color: #bebebe;
}
.nav-search input:focus {
    outline: none;
}
.nav-icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.nav-icon .icon {
    color: white;
    margin: 0px 10px;
}
.nav-icon #new-message {
    color: #eb7979;
}
.nav-icon .icon:hover {
    color: #a5a1a1;
    cursor: pointer;
}
.nav-icon .icon:hover {
    color: #a5a1a1;
    cursor: pointer;
}
.nav-icon .active {
    text-shadow: 0 3px 6px rgba(237, 164, 91, 0.26);
    color: lightcoral;
}
.nav-icon .active:hover {
    color: lightcoral;
}
.nav-icon .nav-img {
    width: 35px;
    height: 35px;
    background-size: cover;
    background-position: center;
    border-radius: 100%;
    margin-left: 10px;
    margin-top: 8px;
}
.searchBox {
    display: inline-block;
    vertical-align: middle;
}
.searchTab {
    display: inline-block;
    cursor: pointer;
    border: none;
    background: 0 0;
}
.icon-search {
    font-size: 1.3em;
    margin-right: 0;
    vertical-align: middle;
}
.searchTab .icon-search {
    font-size: 12px;
    font-weight: 700;
    margin-right: 10px;
}
.searchTab span {
    line-height: 1;
    color: #fff;
    text-shadow: 0 1px 1px rgba(0,0,0,.3);
}
.searchTab:focus {
    outline: 0;
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    -o-transform: scale(1.2);
    transform: scale(1.2);
}
.searchBox {
    display:inline-block;
    vertical-align:middle
}
@media screen and (max-width:400px){
    .navbar {
        height: 100px !important;
    }
    .nav-search {
        color: #bebebe;
        text-align: center;
        width: 100%;
    }
    .nav-icon {
        margin: 0 auto;
    }
    .searchInput input[data-v-1e7cd692] {
        width: 75px;
    }
}
.searchInput {
    display:flex;
    align-items:center;
    background:rgba(0,0,0,.75);
    border:solid 1px rgba(255,255,255,.85)
}
.searchInput input{
    color:lightcoral;
    display:inline-block;
    background:0 0;
    border:none;
    box-sizing:border-box;
    padding:7px 14px 7px 7px;
    font-size:14px;
    width:212px;
    outline:0
}
.searchInput input:focus{
    outline:0
}
.searchInput input::-webkit-input-placeholder{
    color:#999;
    font-weight:400;
    font-size:14px;
    opacity:1;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale
}
.searchInput input::-moz-placeholder{
    color:#999;
    font-weight:400;
    font-size:14px;
    opacity:1;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale
}
.searchInput input:-ms-input-placeholder{
    color:#999;
    font-weight:400;
    font-size:14px;
    opacity:1;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale
}
.searchInput input::-ms-clear{display:none
}
.searchInput .icon-search{padding:0 6px
}
.searchInput .icon-close{cursor:pointer;
    margin:0 6px;
    font-size:13px
}
.searchInput .empty{visibility:hidden
}
.searchTab{display:inline-block;
    cursor:pointer;
    border:none;
    background:0 0
}
.searchTab span{line-height:1;
    color:#fff;
    text-shadow:0 1px 1px rgba(0,0,0,.3)
}
.searchTab .icon-search{font-size:12px;
    font-weight:700;
    margin-right:10px
}
.searchTab .label{left:20px
}
.searchTab:focus{outline:0;
    -webkit-transform:scale(1.2);
    -moz-transform:scale(1.2);
    -ms-transform:scale(1.2);
    -o-transform:scale(1.2);
    transform:scale(1.2)
}
.nav-icon img {
    padding-left: 10px;
    cursor: pointer;
}
</style>
