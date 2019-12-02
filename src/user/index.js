import {Base64} from 'js-base64';

let User = {};
let loginUser = init();
export const LOCAL_STORAGE_KEY = 'authorization_token';
const COUNSELOR_ROLE_ID = "3";
const COUNSELOR_ROLE_ID_STR = "辅导员";

function init() {
    if (window.localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
        return {};
    }
    try {
        return JSON.parse(JSON.parse(
            Base64.decode(
                window.localStorage.getItem(LOCAL_STORAGE_KEY)
                    .split('.')[1]
            )
        ).loginUser);
    } catch (e) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        return {};
    }
}

User.loginUser = loginUser;
User.loginName = loginUser.name;
User.loginRole = loginUser.role;
User.isCounselorLogin = loginUser.role !== undefined ? loginUser.role.id === COUNSELOR_ROLE_ID : false;

User.install = function (Vue, options) {
    Vue.prototype.$user = User;
};
export default User;
