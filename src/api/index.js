const SERVER_HOST = "http://itning:8888";
export const API = {
    users: SERVER_HOST + "/info/users",
    apartment: SERVER_HOST + "/info/apartments",
    search: {
        users: SERVER_HOST + "/info/search/users/",
        leaves: SERVER_HOST + "/leave/search/leaves",
        leaves_check: SERVER_HOST + "/leave/search/leaves/check"
    },
    update_user: SERVER_HOST + "/info/user",
    del_user: SERVER_HOST + "/info/user/",
    update_apartment: SERVER_HOST + "/info/apartment",
    del_apartment: SERVER_HOST + "/info/apartment/",
    add_apartment: SERVER_HOST + "/info/apartment",
    upload_user_file: SERVER_HOST + "/info/user/file",
    login: SERVER_HOST + "/security/login",
    leaves: SERVER_HOST + "/leave/leaves",
    leaves_check: SERVER_HOST + "/leave/leaves/check",
    leave_add_comment: SERVER_HOST + "/leave/leave/comment",
    leave_status_true: SERVER_HOST + "/leave/leave/status/true",
};