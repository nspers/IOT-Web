"use strict";

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import VueI18n from 'vue-i18n'
import iView from 'iview'
import router from './router'
// import Element from 'element-ui'
// import VueSocketio from 'vue-socket.io'
import VueForm from 'vue-form'
import store from './store'
import api from './config'
import common from './assets/js/common.js';
import Validate from './assets/js/validate.js';

//import * as socketApi from './config/ws'
//Vue.prototype.socketApi = socketApi

import 'iview/dist/styles/iview.css'
import './assets/css/reset.css'


Vue.prototype.$api = api
Vue.prototype.$Common = common;
Vue.prototype.$Validate = Validate;
Vue.config.productionTip = false
Vue.config.devtools = true


// Vue.use(new VueSocketio({
//     debug: true,
//     connection: 'http://192.168.8.63:9000/webSocket' //地址+端口，由后端提供
// }));

// Vue.use(VueSocketio, 'http://192.168.8.63:9000/webSocket');

Vue.use(api)

// Vue.use(Element)
// Vue.use(VueI18n)
Vue.use(iView)
Vue.use(VueForm)

// const i18n = new VueI18n({
//     //locale: navigator.language,
//     locale:'en-US',
//     messages: {
//         'zh-CN': require('./common/lang/zh'),
//         'en-US': require('./common/lang/en')
//     }
// })


// const app = new Vue({ i18n })

/* eslint-disable no-new */

Vue.prototype.$getViews = function(path) {
    return resolve => {
        require.ensure([], (require) => {
            if (path.indexOf("controller") != -1) {
                resolve(require('@/components/controller.vue'))
            } else if (path.indexOf("gateway") != -1) {
                resolve(require('@/components/gateway.vue'))
            } else if (path.indexOf("loopdev") != -1) {
                resolve(require('@/components/loopdev.vue'))
            } else if (path.indexOf("loop") != -1) {
                resolve(require('@/components/loop.vue'))
            } else if (path.indexOf("config") != -1) {
                resolve(require('@/components/config.vue'))
            } else if (path.indexOf("order") != -1) {
                resolve(require('@/components/order.vue'))
            } else if (path.indexOf("base") != -1) {
                resolve(require('@/components/base.vue'))
                    // if (path.indexOf("led")) {
                    //     resolve(require('@/components/led.vue'))
                    // } else if (path.indexOf("lcd")) {
                    //     resolve(require('@/components/lcd.vue'))
                    // } else if (path.indexOf("frt")) {
                    //     resolve(require('@/components/equipment.vue'))
                    // }
            } else {
                resolve(require('@/components/' + path + '.vue'))
            }
        })
    }
}

// function getViews(path){
//     return resolve => {
//         require.ensure([], (require) => {
//             resolve(require('@/components/' + path + '.vue'))
//         })
//     }
// }

// router.beforeEach((to,form,next) => {
//     console.log(to,form)
//     let Routers = null
//     if(sessionStorage.router){
//         Routers = JSON.parse(sessionStorage.router)
//         Routers[0].component = getViews(Routers[0].name)
//         for(let i = 0;i < Routers[0].children.length;i++){
//             Routers[0].children[i].component = getViews(Routers[0].children[i].name)
//         }
//     } 

//     if(form.name == null){
//         if(Routers !== null){
//             console.log(router,'刷新并且有路由信息',typeof (Routers), Routers)
//             router.options.routes.push(...Routers)
//             router.addRoutes(Routers)
//             next()
//             // next(to.path)
//         }else{
//             console.log('刷新没有路由信息')
//         }
//     }
//     next()
// })

new Vue({
    el: '#app',
    router,
    // i18n,
    iView,
    store,
    VueForm,
    // Element,
    components: { App },
    template: '<App/>'
        // sockets: {
        //   connect: function () {
        //     console.log('socket connected');
        //   },
        //   res: function (val) {
        //     console.log('接收到服务端消息', val);
        //   }
        // }
}).$mount('#app')