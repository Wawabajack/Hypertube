<template>
    <div class='user-container container-fluid'>
        <div class="card offset-md-4 col-md-4">
            <div class="front">
                <div class="cover">
                    <img src="/img/701909.png"/>
                </div>
                <div class="user">
                    <img class="img-circle" :src="avatar"/>
                </div>
                <div class="content">
                    <div class="main">
                        <h3 class="login">{{ login }}</h3>
                        <p class="lastname">{{ lastname }}</p>
                        <p class="firstname">{{ firstname }}</p>
                        <p class="lang">{{ lang }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            login: '',
            lastname: '',
            firstname: '',
            avatar: '',
            lang: ''
        }
    },
    async beforeCreate() {
        if (!this.$store.state.session) this.$router.push({ name: 'login' })
        else {
            if (this.$route.query.name) {
                this.login = this.$route.query.name
                var result = await this.$store.dispatch('getInfos', this.login)
                if (result) {
                    if (result.data.success) {
                        this.login = result.data.data.user
                        this.lastname = result.data.data.lastname
                        this.firstname = result.data.data.firstname
                        this.avatar = result.data.data.avatar
                        this.lang = result.data.data.lang
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
.user-container, .front {
    width: 100%;
    border-radius: 4px;
    margin-top: 58px;
}
.front {
    border: 1px solid lightcoral
}
.card {
    border-radius: 4px;
    color: white;
    background: none;
}
.card .cover {
    height: 105px;
    overflow: hidden;
    border-radius: 4px 4px 0 0;
}
.card .cover img {
    width: 100%;
}
.card .user {
    border-radius: 50%;
    display: block;
    height: 120px;
    margin: -55px auto 0;
    overflow: hidden;
    width: 120px;
}
.card .user img {
    border: 4px solid #FFFFFF;
    width: 100%;
}
.card .content {
    background-color: rgba(0, 0, 0, 0);
    box-shadow: none;
    padding: 10px 20px 20px;
    text-align: center;
}
.card .content .main {
    min-height: 160px;
}
.card .name {
    font-size: 22px;
    line-height: 28px;
    margin: 10px 0 0;
    text-align: center;
    text-transform: capitalize;
}
</style>