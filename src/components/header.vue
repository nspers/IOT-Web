<template>
    <div class="nav">
        <Icon type="ios-apps" @click="toggleLeft" />
        <span>物联网管理平台</span>
		<div class="leftBottom">
            <Icon type="ios-contact" />{{username}} &nbsp;<a href="javascript:void(0)" @click="signout()">登出</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'App',
    data(){
        return{
            username: window.sessionStorage.getItem("usename")
        }
    },
    methods:{
        toggleLeft(){
            this.$store.commit('toggleNav')
            console.log(this.$store.state.toggle)
        },
        signout(){
            this.$api.get('user/logout').then(function(res){
                sessionStorage.clear()
                location.reload()
            })
        }
    }
}
</script>
<style scoped>
.nav span{font-size: 20px;padding-left: 10px;vertical-align: middle;font-size: .22rem;font-weight: bold;text-shadow: 1px 1px 1px #fff;letter-spacing: 2px;}
</style>
