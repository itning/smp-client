import {Base64} from 'js-base64';

let User = {};
let loginUser = init();
export const LOCAL_STORAGE_KEY = 'authorization_token';
const COUNSELOR_ROLE_ID = "3";

function init() {
    if (window.localStorage.getItem('authorization_token') === null) {
        return {};
    }
    try {
        return JSON.parse(JSON.parse(
            Base64.decode(
                window.localStorage.getItem('authorization_token')
                    .split('.')[1]
            )
        ).loginUser);
    } catch (e) {
        window.localStorage.removeItem('authorization_token');
        return {};
    }
}

User.loginUser = loginUser;
User.loginName = User.loginUser.name;
User.loginRole = User.loginUser.role;
User.isCounselorLogin = function () {
    User.loginUser = init();
    return User.loginUser.role !== undefined ? User.loginUser.role.id === COUNSELOR_ROLE_ID : false;
};
User.install = function (Vue, options) {
    Vue.prototype.$user = User;
};
export default User;
