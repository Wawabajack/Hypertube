<template>
    <div>
        <footer>Copyright © 2019 <span class="title">Hypertube</span> - <span class="name">tbroggi</span></footer>
    </div>
</template>

<script>
export default {
	name: "Footer",
}
</script>

<style scoped>
footer {
    margin-top: 60px;
    text-align: center;
    border-top: 1px solid lightcoral;
    color: lightcoral;
    padding: 20px;
    font-size: small;
}
footer .name {
    font-style: italic;
}
footer .title {
    font-weight: 600;
}
</style>
