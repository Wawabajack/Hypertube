<template>
	<div>
		<router-link to="/login" class="login-back"><i class="fas fa-arrow-left"></i></router-link>
		<span class="login-title">Reset password !</span>
		<p class="login-content">Please enter your new password</p>
		<div class="login-input">
			<i class="fas fa-key"></i>
			<input type="password" placeholder="Mot de passe" v-model="password">
		</div>
		<div class="login-input">
			<i class="fas fa-key"></i>
			<input type="password" placeholder="Mot de passe confirmation" v-model="passwordConfirmation" >
		</div>
		<button class="button" @click="forgot">Reset</button>
	</div>
</template>

<script>
export default {
	name: 'BoxChangePass',
	data() {
		return {
			password: '',
			passwordConfirmation: '',
		}
	},
	methods: {
		async forgot() {
			var result = await this.$store.dispatch('reset', this);
			if (result) {
				if (result.data.success) {
					this.notify('Successful', 'Your password has been reset', 'success')
					this.$router.push({ name: 'login' })
				} else this.notify('Error!', result.data.en_error, 'error')
			}
		},
		notify(title, message, type) {
			this.$notify({
				title: title,
				message: message,
				type: type
			})
		}
	}
}
</script>

<style scoped>
.button {
	width: 180px;
	height: 38px;
	border-radius: 50px;
	-webkit-transition: box-shadow 0.2s ease;
	-webkit-transition: -webkit-box-shadow 0.2s ease;
	transition: -webkit-box-shadow 0.2s ease;
	transition: box-shadow 0.2s ease;
	transition: box-shadow 0.2s ease, -webkit-box-shadow 0.2s ease;
	-webkit-box-shadow: 0 3px 10px rgba(0, 0, 0, 0.13);
					box-shadow: 0 3px 10px rgba(0, 0, 0, 0.13);
	background-color: #a3a3a3;
	text-align: center;
	border: none;
	clear: both;
	margin: 0 auto;
	margin-top: 80px;
	display: block;
	/* Text */
	color: #ffffff;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 14px;
}
.button:hover {
	-webkit-box-shadow: 0 12px 15px rgba(0, 0, 0, 0.25);
					box-shadow: 0 12px 15px rgba(0, 0, 0, 0.25);
	cursor: pointer;
}
.button:focus {
	outline: none;
}
.button:disabled, button[disabled] {
	background-image: #868686;
}
.login {
	position: relative;
	top: 50vh;
	-webkit-transform: translateY(-50%);
					transform: translateY(-50%);
	min-width: 300px;
}
.login-title {
	color: white;
	font-size: 42px;
	display: block;
	margin-bottom: -10px;
}
.login-content {
	color: #a3a3a3;
	font-size: 14px;
	margin-left: 3px;
	margin-bottom: 50px;
}
.login-input {
	border-bottom: 2px solid #a3a3a3;
	padding: 6px 0px;
	margin: 5px;
	margin-bottom: 30px;
	width: auto;
	color: #bebebe;
}
.login-input i {
		color: white;
}
.good-input {
	border-color: #43a1e5;
	color: #43a1e5;
}
.bad-input {
	border-color: #e05b5b;
	color: #e05b5b;
}
.login-input > input:focus {
	color: #8d8d8d;
	outline: none;
}
.login-input > input, input::placeholder {
	color: white;
	font-size: 16px;
	border: none;
	width: 80%;
	background: none;
}
input::placeholder {
	color: #bebebe;
}
.login-input > .fas {
	font-size: 16px;
	margin-right: 10px;
	color: white;
}
.fas.fa-arrow-left {
		color: white;
}
.login-register {
	color: #43a1e5;
	font-size: 14px;
	padding-left: 4px;
	margin-top: 30px;
}
.login-forget {
	color: #43a1e5;
	font-size: 14px;
	float: right;
}
.login-bg {
	position: absolute;
	top: 50vh;
	-webkit-transform: translateY(-50%);
					transform: translateY(-50%);
	min-width: 300px;
	margin: 0 auto;
}
.register-box {
	text-align: center;
	background: #e05b5b;
	border-radius: 5px;
	padding: 10px 5px;
	margin-bottom: 15px;
	color: white;
}
.register-box-avatar {
	text-align: center;
	color: white;
	font-size: 16px;
}
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409EFF;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
</style>