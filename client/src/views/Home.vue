<template>
	<div class="container-fluid">
		<div class="contain">
			<div class="torrents-details" v-if="!loading">
				<h5 class='title'>{{ $store.state.lang === 'en' ? 'Last RARBG\'s torrents' : 'Les derniers torrents RARBG' }}</h5>
				<table>
					<tr class="main">
						<th class="name"> {{ $store.state.lang === 'en' ? 'Name' : 'Nom' }}</th>
						<th class="quality">{{ $store.state.lang === 'en' ? 'Quality' : 'Qualité' }}</th>
						<th class="size">{{ $store.state.lang === 'en' ? 'Size' : 'Taille' }}</th>
						<th class="seeds">Seeders</th>
						<th class="peers">Leechers</th>
						<th class="dl"></th>
					</tr>
					<tr class="item" v-for="(lastTorrent, index) in lastTorrents" :key="`lastTorrent-${index}`">
						<td class="name">{{ lastTorrent.title }}</td>
						<td class="quality">{{ lastTorrent.category.split('/').pop() }}</td>
						<td class="size">{{ getSize(lastTorrent.size) }}</td>
						<td class="seeds">{{ lastTorrent.seeders }}</td>
						<td class="peers">{{ lastTorrent.leechers }}</td>
						<td class="view"><i class="el-icon-view" @click="view(lastTorrent.episode_info.imdb, lastTorrent.episode_info.themoviedb)"></i></td>
					</tr>
				</table>
				<h5 class='title'>{{ $store.state.lang === 'en' ? 'Top seeders RARBG\'s torrents' : 'Les torrents RARBG avec le plus de seeders' }}</h5>
				<table>
					<tr class="main">
						<th class="name">{{ $store.state.lang === 'en' ? 'Name' : 'Nom' }}</th>
						<th class="quality">{{ $store.state.lang === 'en' ? 'Quality' : 'Qualité' }}</th>
						<th class="size">{{ $store.state.lang === 'en' ? 'Size' : 'Taille' }}</th>
						<th class="seeds">Seeders</th>
						<th class="peers">Leechers</th>
						<th class="dl"></th>
					</tr>
					<tr class="item" v-for="(seedersTorrent, index) in seedersTorrents" :key="`seedersTorrent-${index}`">
						<td class="name">{{ seedersTorrent.title }}</td>
						<td class="quality">{{ seedersTorrent.category.split('/').pop() }}</td>
						<td class="size">{{ getSize(seedersTorrent.size) }}</td>
						<td class="seeds">{{ seedersTorrent.seeders }}</td>
						<td class="peers">{{ seedersTorrent.leechers }}</td>
						<td class="view"><i class="el-icon-view" @click="view(seedersTorrent.episode_info.imdb, seedersTorrent.episode_info.themoviedb)"></i></td>
					</tr>
				</table>
				<h5 class='title'>{{ $store.state.lang === 'en' ? 'Top leechers RARBG\'s torrents' : 'Les torrents RARBG avec le plus de leechers' }}</h5>
				<table>
					<tr class="main">
						<th class="name">{{ $store.state.lang === 'en' ? 'Name' : 'Nom' }}</th>
						<th class="quality">{{ $store.state.lang === 'en' ? 'Quality' : 'Qualité' }}</th>
						<th class="size">{{ $store.state.lang === 'en' ? 'Size' : 'Taille' }}</th>
						<th class="seeds">Seeders</th>
						<th class="peers">Leechers</th>
						<th class="dl"></th>
					</tr>
					<tr class="item" v-for="(leechersTorrent, index) in leechersTorrents" :key="`leechersTorrent-${index}`">
						<td class="name">{{ leechersTorrent.title }}</td>
						<td class="quality">{{ leechersTorrent.category.split('/').pop() }}</td>
						<td class="size">{{ getSize(leechersTorrent.size) }}</td>
						<td class="seeds">{{ leechersTorrent.seeders }}</td>
						<td class="peers">{{ leechersTorrent.leechers }}</td>
						<td class="view"><i class="el-icon-view" @click="view(leechersTorrent.episode_info.imdb, leechersTorrent.episode_info.themoviedb)"></i></td>
					</tr>
				</table>
			</div>
			<div class="animation" v-else>
				<box-loading/>
			</div>
		</div>
	</div>
</template>

<script>
import BoxLoading from '@/components/BoxLoading.vue'

export default {
	data() {
		return {
			lastTorrents: [],
			seedersTorrents: [],
			leechersTorrents: [],
			loading: true,
		}
	},
	async beforeCreate() {
		if (!this.$store.state.session) this.$router.push({ name: 'login'})
		else {
			var result = await this.$store.dispatch('recommanded')
			if (result) {
				if (result.data.success) {
					this.loading = false
					this.lastTorrents = result.data.data.lastTorrents.filter(torrent => { return torrent.size / 1000000000 < 10 && torrent.category.split('/').pop() !== '3D' })
					this.seedersTorrents = result.data.data.seedersTorrents.filter(torrent => { return torrent.size / 1000000000 < 10 && torrent.category.split('/').pop() !== '3D' })
					this.leechersTorrents = result.data.data.leechersTorrents.filter(torrent => { return torrent.size / 1000000000 < 10 && torrent.category.split('/').pop() !== '3D' })
				}
			}
		}
	},
	methods: {
		view(movieId, tmpId) {
			this.$router.push({ path: `/movie?tmp=${tmpId}&id=${movieId}` })
		},
		getSize(size) {
            if (size / 1000000000 > 1) return (size / 1000000000).toFixed(2) + ' GB'
            else return (size / 100000000).toFixed(2) + ' MB'
        },
	},
    components: {
        BoxLoading
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
.torrents-details th {
    color: #bebebe;
    font-size: small;
    font-style: italic;
}
.torrents-details tr {
    color: white;
    font-size: small;
}
.torrents-details table {
    width: 80%;
    margin-top: 20px;
	margin: auto;
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
</style>


