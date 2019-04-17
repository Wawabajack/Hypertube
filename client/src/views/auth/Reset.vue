<template>
    <main role="main" class="row">
        <box-reset class="login col-12 col-md-8 offset-md-2 col-lg-5 offset-lg-1 col-xl-4 offset-xl-2"/>
        <div class="d-none d-md-none d-lg-block col-12 col-lg-6 col-xl-5">
            <img src="/img/bg.png" class="img-fluid login-bg" alt="Responsive image">
        </div>
    </main>
</template>

<script>
import BoxReset from '@/components/auth/BoxReset.vue'

export default {
    components: {
        BoxReset,
		}
}
</script>

<style scoped>
.login-bg {
  position: absolute;
  top: 50vh;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
  min-width: 300px;
  margin: 0 auto;
}
</style>
