<template>
	<div id='BoxActivate'>
		<div class='my-3 p-3 rounded mx-auto col-lg-6 col-md-8 col-sm-10'>
			<el-alert
				:title='title'
				:type='success'
				:closable='false'
				center
			/>
		</div>
	</div>
</template>

<script>
	export default {
		// Name
		name: 'BoxActivate',
		props: ['success', 'title']
	}
</script>

<style scoped>
#BoxActivate {
	margin-top: 50vh;
	transform: translateY(-50%);
}
</style>

