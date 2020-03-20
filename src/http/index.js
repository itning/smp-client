import Vue from 'vue'
import HelpConfig from "@itning/axios-helper/dist/HelpConfig";

HelpConfig.errorMsgImpl = {
    showErrorToast(title, data) {
        let msg;
        if (typeof data === "string") {
            msg = data;
        } else {
            msg = data.msg;
        }
        Vue.prototype.$notification['error']({
            message: title,
            description: msg,
            duration: 4.5,
            onClose: () => {
                HelpConfig.onceMsgFinish();
            }
        });
    }
};
HelpConfig.axiosInstanceBuilder
    .timeOut(1000 * 12)
    .requestInterceptor({
        onFulfilled: request => {
            let token = window.localStorage.getItem('authorization_token');
            if (token !== undefined) {
                request.headers = {
                    "Authorization": token,
                    "Accept": "application/json"
                };
            } else {
                request.headers = {"Accept": "application/json"};
            }
            return request;
        },
        onRejected: error => Promise.reject(error)
    })
    .responseInterceptor({
        onFulfilled: response => Promise.resolve(response),
        onRejected: error => {
            if (error.response === undefined) {
                RequestActuator.errorMessage.showErrorMsg('网络异常', '请检查网络连接状态后再试');
                return Promise.reject(error);
            }
            if (error.response.status) {
                switch (error.response.status) {
                    case 401:
                        window.localStorage.setItem('last_path', window.location.pathname);
                        setTimeout(() => {
                            window.location.href = "/security";
                        }, 2000);
                        RequestActuator.errorMessage.showOnceErrorMsg('错误', error.response.data.msg);
                        return;
                    case 403:
                        console.warn('权限不足');
                        break;
                    case 404:
                        console.warn('请求URL不存在');
                        break;
                    case 500:
                        console.warn('服务器错误');
                        break;
                    case 503:
                        console.warn('服务器错误');
                        break;
                    default:
                        console.warn(error);
                }
                return Promise.reject(error);
            }
        }
    })
    .build();

