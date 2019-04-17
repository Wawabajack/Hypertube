<template>
    <main role='main' class='home container'>
        <box-activate :success='success' :title='title'/>
    </main>
</template>

<script>
// @ is an alias to /src
import BoxActivate from '@/components/auth/BoxActivate.vue'

export default {
    name: 'Activate',
    data () {
        return {
            success: '',
            title: '',
        }
    },
    async beforeCreate() {
        var result = await this.$store.dispatch('activate', this.$route.params.token)
        if (result) {
            this.success = result.data.success ? 'success' : 'error'
            this.title = result.data.success ? 'Account validated, you may login' : result.data.error
            setTimeout(() => { this.$router.push({ path: '/login'})}, 3000);
        }
    },
    components: {
        BoxActivate,
    }
}
</script>
