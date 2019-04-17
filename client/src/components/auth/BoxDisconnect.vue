<template>
	<div id="BoxDisconnect">
		<div class="my-3 p-3 rounded mx-auto col-lg-6 col-md-8 col-sm-10">
			<el-alert
				title="You just logged out. See you soon"
				type="success"
				:closable="false"
				center
			/>
		</div>
	</div>
</template>

<script>
	export default {
		// Name
		name: 'BoxDisconnect',
	}
</script>

<style scoped>
#BoxDisconnect {
	margin-top: 50vh;
	transform: translateY(-50%);
}
</style>