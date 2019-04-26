<template>
    <div class="container">
        <div class="bar bar1"></div>
        <div class="ball"></div>
        <div class="bar bar2"></div>
    </div>
</template>

<script>
import anime from 'animejs'

export default {
    mounted() {
        this.loadingInitialize()
    },
    methods: {
        loadingInitialize() {
            var loop = true;
            var easing = 'linear';
            var direction = 'alternate';

            anime({
                targets: '.ball',
                translateX: 470,
                translateY: 100,
                easing,
                loop,
                direction
            })
            var ballTimeline = anime.timeline({
                loop,
                direction
            })
            var bar2Timeline = anime.timeline({
                loop,
                direction
            })
            var bar1Timeline = anime.timeline({
                loop,
                direction
            })
            ballTimeline
                .add({
                    targets: '.ball',
                    translateY: 100,
                    translateX: 450,
                    easing
                }).add({
                    targets: '.ball',
                    translateY: 0,
                    translateX: 0,
                    easing
                }).add({
                    targets: '.ball',
                    translateY: '-80',
                    translateX: 450,
                    easing
                })
            bar2Timeline
                .add({
                    targets: '.bar2',
                    translateY: 100,
                    easing
                }).add({
                    targets: '.bar2',
                    translateY: 0,
                    easing
                }).add({
                    targets: '.bar2',
                    translateY: '-100',
                    easing
                })
            bar1Timeline
                .add({
                    targets: '.bar1',
                    translateY: '-80',
                    easing
                }).add({
                    targets: '.bar1',
                    translateY: 10,
                    easing
                }).add({
                    targets: '.bar1',
                    translateY: 60,
                    easing
                })
        }
    }
}
</script>

<style scoped>
.container {
    width: 500px;
    display: inline-block;
    transform: translateY(200px);
}
.bar {
    background: lightcoral;
    width: 10px;
    height: 100px;
}
.bar1 {
    float: left;
}
.bar2 {
    float: right;
}
.ball {
    background: white;
    width: 10px;
    height: 10px;
    position: relative;
    top: 45px;
    left: 10px;
}
</style>
