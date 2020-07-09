<template>
    <div id="app">
        <!-- <keep-alive> -->
        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
        <!-- </keep-alive> -->
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>
