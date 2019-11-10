import Vue from 'vue'
import VueRouter from 'vue-router'
import AllStudent from '../views/AllStudent.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: AllStudent
    },
    {
        path: '/apartment',
        name: 'apartment',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "apartment" */ '../views/AllApartment.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
