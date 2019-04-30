<template>
    <div class="container-fluid">
        <div class="row account-container">
            <h3 class="title">{{ $store.state.lang === "en" ? "Settings" : "Paramètres" }}</h3>
            <h4 class="login">{{ login }}</h4>
            <div class="avatar">
                <img v-if="avatar" :src="avatar" :alt="login"/>
                <img v-else src="img/notfound.png" :alt="login"/>
            </div>
            <div class="group">      
                <input type="text" v-model="lastname" required @blur="updateLastname()">
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>{{ $store.state.lang === "en" ? "Lastname" : "Nom" }}</label>
            </div>
            <div class="group">      
                <input type="text" v-model="firstname" required @blur="updateFirstname()">
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>{{ $store.state.lang === "en" ? "Firstname" : "Prénom" }}</label>
            </div>
            <div class="group" v-if="email">      
                <input type="email" v-model="email" required v-if="oldpassword" @blur="updateEmail()">
                <input type="email" disabled v-model="email" required v-else>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>Email</label>
            </div>
            <div class="group" v-if="oldpassword">      
                <input type="password" v-model="password" required>
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>{{ $store.state.lang === "en" ? "Password" : "Mot de passe" }}</label>
            </div>
            <div class="group" v-if="oldpassword">      
                <input type="password" v-model="passwordConfirmation" required @blur="updatePassword()">
                <span class="highlight"></span>
                <span class="bar"></span>
                <label>{{ $store.state.lang === "en" ? "Password confirmation" : "Confirmation du mot de passe" }}</label>
            </div>
            <input type="file" id="file" ref="file"/>
            <el-button type="primary" @click="updateAvatar()">Submit</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            login: '',
            email: '',
            lastname: '',
            firstname: '',
            avatar: '',
            oldpassword: '',
            password: '',
            passwordConfirmation: ''
        }
    },
    async beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
        else {
            var result = await this.$store.dispatch('getMyInfos')
            if (result)
                if (result.data.success) {
                    this.login = result.data.data.login
                    this.email = result.data.data.email
                    this.lastname = result.data.data.lastname
                    this.firstname = result.data.data.firstname
                    this.oldpassword = result.data.data.password
                    this.avatar = result.data.data.avatar
                }
        }
    },
    methods: {
        async updateLastname() {
            var result = await this.$store.dispatch('updateLastname', this.lastname)
            if (result) if (!result.data.success) this.$store.state.lang === 'en' ? this.notify('Error!', result.data.en_error, 'error') : this.notify('Erreur!', result.data.fr_error, 'error')
        },
        async updateFirstname() {
            var result = await this.$store.dispatch('updateFirstname', this.firstname)
            if (result) if (!result.data.success) this.$store.state.lang === 'en' ? this.notify('Error!', result.data.en_error, 'error') : this.notify('Erreur!', result.data.fr_error, 'error')
        },
        async updateAvatar() {
            this.avatar = this.$refs.file.files[0]
            var result = await this.$store.dispatch('updateAvatar', this.avatar)
            if (result) if (!result.data.success) this.$store.state.lang === 'en' ? this.notify('Error!', result.data.en_error, 'error') : this.notify('Erreur!', result.data.fr_error, 'error')
        },
        async updateEmail() {
            var result = await this.$store.dispatch('updateEmail', this.email)
            if (result) if (!result.data.success) this.$store.state.lang === 'en' ? this.notify('Error!', result.data.en_error, 'error') : this.notify('Erreur!', result.data.fr_error, 'error')
        },
        async updatePassword() {
            var result = await this.$store.dispatch('updatePassword', this)
            if (result) if (!result.data.success) this.$store.state.lang === 'en' ? this.notify('Error!', result.data.en_error, 'error') : this.notify('Erreur!', result.data.fr_error, 'error')
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
.account-container {
    color: white;
    font-family: 'Roboto';
    width: 600px;
    display: block;
    padding: 116px 50px 50px;
    margin: 0 auto;
    text-align: center;
}
h3.title {
    text-align: center;
    padding: 25px;
    color: lightcoral;
}
h4.login {
    text-align: center;
    padding-bottom: 40px;
    color: #bebebe;
    font-size: larger;
}
.group { 
    position:relative; 
    margin-bottom:45px; 
}
.group input {
    font-size:18px;
    padding:10px 10px 10px 5px;
    display:block;
    width:300px;
    border:none;
    border-bottom:1px solid #757575;
    background: none;
    margin: auto;
    color: white;
}
.group input:focus {
    outline:none;
}

/* LABEL ======================================= */
.group label {
    color:#999; 
    font-weight:normal;
    position:absolute;
    pointer-events:none;
    left:100px;
    top:10px;
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
}

/* active state */
.group input:focus ~ label, .group input:valid ~ label, .group input:disabled ~ label {
    top:-20px;
    font-size:14px;
    color:white;
}

/* BOTTOM BARS ================================= */
.bar {
    position: relative;
    display: block;
    width: 300px;
    margin: auto;
}
.bar:before, .bar:after {
    content:'';
    height:2px; 
    width:0;
    bottom:1px; 
    position:absolute;
    background:lightcoral; 
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
}
.bar:before {
    left:50%;
}
.bar:after {
    right:50%; 
}

/* active state */
.group input:focus ~ .bar:before, .group input:focus ~ .bar:after {
    width:50%;
}

/* HIGHLIGHTER ================================== */
.highlight {
    position:absolute;
    height:60%; 
    width:100px; 
    top:25%; 
    left:100px;
    pointer-events:none;
    opacity:0.5;
}

/* active state */
.group input:focus ~ .highlight {
    -webkit-animation:inputHighlighter 0.3s ease;
    -moz-animation:inputHighlighter 0.3s ease;
    animation:inputHighlighter 0.3s ease;
}

/* ANIMATIONS ================ */
@-webkit-keyframes inputHighlighter {
	from { background:lightcoral; }
    to 	{ width:0; background:transparent; }
}
@-moz-keyframes inputHighlighter {
	from { background:lightcoral; }
    to 	{ width:0; background:transparent; }
}
@keyframes inputHighlighter {
	from { background:lightcoral; }
    to 	{ width:0; background:transparent; }
}

.avatar img {
    height: 250px;
    width: 250px;
    margin-bottom: 50px;
}
</style>

