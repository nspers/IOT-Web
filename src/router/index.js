import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'


Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: 'iot',
    routes: [{
            path: '/login',
            name: 'login',
            component: (resolve) => require(['@/components/login2'], resolve)
        },
        // {
        //     path: '/deploy',
        //     name: 'deploy',
        //     component: (resolve) => require(['@/components/deploy'], resolve),
        //     children: [{
        //         path: '/lightComGateway',
        //         name: 'lightComGateway',
        //         component: (resolve) => require(['@/components/lightComGateway'], resolve)
        //     }, {
        //         path: '/lightComLoop',
        //         name: 'lightComLoop',//集控器 => 回路(做成组件插入集控器中)) 
        //         component: (resolve) => require(['@/components/lightComLoop'], resolve)
        //     }, {
        //         path: '/light',
        //         name: 'light',//单灯控制器 !!controller
        //         component: (resolve) => require(['@/components/light'], resolve)
        //     }, {
        //         path: '/loop',
        //         name: 'loop',//回路链接？
        //         component: (resolve) => require(['@/components/loop'], resolve)
        //     }, {
        //         path: '/gateway',
        //         name: 'gateway',//集控器 !!gateway
        //         component: (resolve) => require(['@/components/gateway'], resolve)
        //     }, {
        //         path: '/led',
        //         name: 'led', //!!base
        //         component: (resolve) => require(['@/components/led'], resolve)
        //     }, {
        //         path: '/lcd',
        //         name: 'lcd', // !!base
        //         component: (resolve) => require(['@/components/lcd'], resolve)
        //     }, {
        //         path: '/cfg',
        //         name: 'cfg', //!!config
        //         component: (resolve) => require(['@/components/cfg'], resolve)
        //     }, {
        //         path: '/msg',
        //         name: 'msg', //!!order
        //         component: (resolve) => require(['@/components/msg'], resolve)
        //     }, {
        //         path: '/equipment',
        //         name: 'equipment', //!!base
        //         component: (resolve) => require(['@/components/equipment'], resolve)
        //     }]
        // },
        {
            path: "*",
            name: "error",
            component: (resolve) => require(['@/components/error'], resolve)
        }
    ]
})

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

let newRouter = null
if (sessionStorage.router) {
    newRouter = JSON.parse(sessionStorage.router)
    newRouter[0].component = Vue.prototype.$getViews(newRouter[0].name)
    for (let i = 0; i < newRouter[0].children.length; i++) {
        newRouter[0].children[i].component = Vue.prototype.$getViews(newRouter[0].children[i].url)
    }
    router.options.routes.push(...newRouter)
    router.addRoutes(newRouter)
}

router.beforeEach((to, form, next) => {

    if (sessionStorage.router) {
        newRouter = JSON.parse(sessionStorage.router)
        newRouter[0].component = Vue.prototype.$getViews(newRouter[0].name)
        for (let i = 0; i < newRouter[0].children.length; i++) {
            newRouter[0].children[i].component = Vue.prototype.$getViews(newRouter[0].children[i].url)
        }

        for (let index = 0; index < newRouter[0].children.length; index++) {
            if (to.fullPath == newRouter[0].children[index].path) {
                store.state.index = newRouter[0].children[index].parent
                store.state.subtitle = newRouter[0].children[index].name
            }
        }

    }

    if (to.path != '/login') {
        if (sessionStorage.loginIOT != undefined && sessionStorage.loginIOT == 'true') {
            next()
        } else {
            next('/login')
        }
    } else if (sessionStorage.loginIOT != undefined && sessionStorage.loginIOT == 'true') {
        next('/shuncom-config')
    } else {
        next()
    }
})

export default router