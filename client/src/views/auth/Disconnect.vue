<template>
    <main role="main" class="home container">
        <BoxDisconnect/>
    </main>
</template>

<script>
// @ is an alias to /src
import BoxDisconnect from '@/components/auth/BoxDisconnect.vue'

export default {
    name: 'Disconnect',
    beforeCreate() {
        if (!this.$store.state.session)
            this.$router.push({ name: 'login'}); 
        else {
            this.$store.dispatch('disconnect', this);
            setTimeout( () => this.$router.push({ path: '/' }), 1500);
        }
	},
    components: {
        BoxDisconnect,
    }
}
</script>
