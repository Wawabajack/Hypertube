<template>
  <div id="BoxLogin">
    <p class="login-title">Welcome,</p>
    <p class="login-content">Thanks to login.</p>

    <div class="login-input">
      <i class="fas fa-user-tag"></i>
      <input type="text" placeholder="Pseudo" @keypress.enter="login" v-model="user.login">
    </div>
    <div class="login-input">
      <i class="fas fa-key"></i>
      <input
        type="password"
        placeholder="Mot de passe"
        @keypress.enter="login"
        v-model="user.password"
      >
    </div>

    <router-link to="/register" class="login-register">Registration</router-link>
    <router-link to="/forgotPass" class="login-forget">Password forgotten ?</router-link>
    <ul class="connexion">
      <li>
        <!-- <a href="https://api.intra.42.fr/oauth/authorize?client_id=01dac0c084ae2a6ac29ee0a880d2769e731682b34478bd75a8849dfd1650f08c&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2F42&response_type=code">42</a> -->
        <a href="http://localhost:4000/auth/fortytwo/">42</a>
      </li>
      <li>
        <!--	<a href='https://github.com/login/oauth/authorize?client_id=a92145361450ff616ae0'>GITHUB</a> -->
        <a href="http://localhost:4000/auth/github/">GITHUB</a>
      </li>
      <li>
          <!--  <a href="https://slack.com/oauth/authorize?client_id=603373723154.603304870643&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fslack&response_type=code&scope=identify">Slack</a> -->
        <a href="http://localhost:4000/auth/slack/">Slack</a>
      </li>
      <li>
        <!-- <a href="https://id.twitch.tv/oauth2/authorize?client_id=6dyk1rffx2sq6ger9kk7qpa588bbxn&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2Ftwitch&response_type=code">Twitch</a> -->
        <a href="http://localhost:4000/auth/twitch/">Twitch</a>
      </li>
      <li>
        <!-- <a href="https://discordapp.com/api/oauth2/authorize?client_id=569901989304205357&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fdiscord&response_type=code&scope=identify%20email">Discord</a> -->
        <a href="http://localhost:4000/auth/discord/">Discord</a>
      </li>
      <li>
        <a href="http://localhost:4000/auth/google/">Google</a>
      </li>
    </ul>
    <button class="button" @click="login">Login</button>
  </div>
</template>

<script>
import BoxForgot from "@/components/auth/BoxForgot.vue";
import Vue from "vue";
import Vuex from "vuex";

export default {
  name: "BoxLogin",

  components: {
    BoxForgot
  },

  data() {
    return {
      user: {
        login: "",
        password: ""
      },
      oauthMethod: "",
      oauthCode: ""
    };
  },

  async beforeCreate() {
    if (this.$route.params.oauthCode) {
      this.oauthCode = this.$route.params.oauthCode;
      this.oauthMethod = this.$route.params.oauthMethod;
      var result = await this.$store.dispatch("loginOauth", this);
      if (result) {
        if (result.data.success) {
          this.notify(
            "Login successful",
            "Welcome and enjoy Hypertube :-)",
            "success"
          );
          this.$router.push({ name: "home" });
        } else this.notify("Error!", result.data.en_error, "error");
      }
    }
  },

  created() {
		if (this.$route.query.loggin && this.$route.query.key)
		{
			console.log("ici")
			this.logingit()
		}
    if (this.$route.params.login) this.user.login = this.$route.params.login;
  },

  methods: {
		async logingit() {
      this.user.login = this.$route.query.loggin;
      this.user.key = this.$route.query.key;
      var result = await this.$store.dispatch("logingit", this);
        if (result) {
          console.log(result)
        if (result.data.success) {
          this.notify( "Login successful", "Welcome and enjoy Hypertube :-)", "success" );
          this.$router.push({ name: "home" });
        } else this.notify("Error!", result.data.en_error, "error");
      }
		},
		
    async login() {
      var result = await this.$store.dispatch("login", this);
      if (result) {
        if (result.data.success) {
          this.notify( "Login successful", "Welcome and enjoy Hypertube :-)", "success" );
          this.$router.push({ name: "home" });
        } else this.notify("Error!", result.data.en_error, "error");
      }
    },
    notify(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type
      });
    }
  }
};
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
.button:disabled,
button[disabled] {
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
.login-input > input,
input::placeholder {
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
.login-register {
  color: #a3a3a3;
  font-size: 14px;
  padding-left: 4px;
  margin-top: 30px;
}
.login-forget {
  color: #a3a3a3;
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
.connexion {
  margin-top: 80px;
  text-align: center;
  list-style: none;
}
.connexion li {
  display: inline-flex;
}
.connexion li a {
  padding-right: 20px;
  text-decoration: none;
  color: #a3a3a3;
}
</style>

