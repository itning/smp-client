import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const SET_STUDENT_ROOM_CHECK_DATA = 'setStudentRoomCheckData';

export default new Vuex.Store({
    state: {
        now_path: '',
        studentRoomCheckData: []
    },
    getters: {
        studentRoomCheckData: state => {
            return state.studentRoomCheckData;
        },
        studentRoomCheckDataId: state => {
            return state.studentRoomCheckData.map(studentRoomCheckData => studentRoomCheckData.id);
        }
    },
    mutations: {
        setStudentRoomCheckData(state, data) {
            state.studentRoomCheckData = data
        }
    },
    actions: {},
    modules: {}
})