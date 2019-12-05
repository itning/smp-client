import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from '../store'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/first'
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
    },
    {
        path: "/leave",
        name: "Leave",
        component: () => import(/* webpackChunkName: "leave" */ '../views/Leave.vue')
    },
    {
        path: "/leave_check",
        name: "LeaveCheck",
        component: () => import(/* webpackChunkName: "leave_check" */ '../views/LeaveCheck.vue')
    },
    {
        path: "/room",
        name: "Room",
        component: () => import(/* webpackChunkName: "room" */ '../views/Room.vue')
    },
    {
        path: "/personal",
        name: "Personal",
        component: () => import(/* webpackChunkName: "personal" */ '../views/Personal.vue')
    },
    {
        path: "/roomPicWaterFall",
        name: "RoomPicWaterFall",
        component: () => import(/* webpackChunkName: "roomPicWaterFall" */ '../views/RoomPicWaterFall.vue')
    },
    {
        path: "/first",
        name: "First",
        component: () => import(/* webpackChunkName: "first" */ '../views/First.vue')
    },
    {
        path: '*',
        redirect: '/first'
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
