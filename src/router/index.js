import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from '../store'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/student'
    },
    {
        path: '/apartment',
        name: 'apartment',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "apartment" */ '../views/AllApartment.vue')
    },
    {
        path: '/student',
        name: 'student',
        component: () => import(/* webpackChunkName: "student" */ '../views/AllStudent.vue')
    },
    {
        path: '/new_student',
        name: 'NewStudent',
        component: () => import(/* webpackChunkName: "new_student" */ '../views/NewStudent.vue')
    },
    {
        path: "/security",
        name: "Security",
        component: () => import(/* webpackChunkName: "security" */ '../views/Security.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.afterEach((to, from) => {
    Vuex.state.now_path = to.path;
});

export default router
