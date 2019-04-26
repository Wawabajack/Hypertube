<template>
    <main role="main" class="row">
        <box-login class="login col-12 col-md-8 offset-md-2 col-lg-4 offset-lg-1 col-xl-4 offset-xl-2"/>
        <div class="d-none d-md-none d-lg-block col-12 col-lg-6 col-xl-5">
            <img src="/img/bg.png" class="img-fluid login-bg" alt="Responsive image">
        </div>
    </main>
</template>

<script>
import BoxLogin from '@/components/auth/BoxLogin.vue'

export default {
  name: 'Login',
  beforeCreate() {
    if (this.$store.state.session) this.$router.push({ name: 'home'})
  },
  components: {
    BoxLogin,
  }
}
</script>

<style scoped>
.login {
  position: relative;
  top: 50vh;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
  min-width: 300px;
}

.login-title {
  color: #707070;
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

.login-input > input, input::-webkit-input-placeholder {
  color: #bebebe;
  font-size: 16px;
  border: none;
  width: 80%;
}

.login-input > input, input:-ms-input-placeholder {
  color: #bebebe;
  font-size: 16px;
  border: none;
  width: 80%;
}

.login-input > input, input::-ms-input-placeholder {
  color: #bebebe;
  font-size: 16px;
  border: none;
  width: 80%;
}

.login-input > input, input::placeholder {
  color: #bebebe;
  font-size: 16px;
  border: none;
  width: 80%;
}

.login-input > .fas {
  font-size: 16px;
  margin-right: 10px;
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
</style>
