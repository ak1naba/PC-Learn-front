<template>
    <div class="preloader">
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
    </div>
</template>

<script>
export default {
    name: "preloader"
}
</script>

<style scoped>


.preloader {
    width: 80px;
    height: 100px;
    margin: 10px auto;
}

.block {
    position: relative;
    box-sizing: border-box;
    float: left;
    margin: 0 10px 10px 0;
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: #151029;
}

.block:nth-child(4n+1) { animation: wave 2s ease .0s infinite; }
.block:nth-child(4n+2) { animation: wave 2s ease .2s infinite; }
.block:nth-child(4n+3) { animation: wave 2s ease .4s infinite; }
.block:nth-child(4n+4) { animation: wave 2s ease .6s infinite; margin-right: 0; }

@keyframes wave {
    0%   { top: 0;     opacity: 1; }
    50%  { top: 30px;  opacity: .2; }
    100% { top: 0;     opacity: 1; }
}
</style>
