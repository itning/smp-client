import {API} from "../api";

export default function layxLoader() {   // <-- 原作者这里使用的是module.exports
    return new Promise((resolve, reject) => {
        if (window.layx) {
            resolve(window.layx)
        } else {
            // <link href="layx.min.css" rel="stylesheet" type="text/css" />
            var link = document.createElement("link");
            link.type = "text/css";
            link.href = "layx.min.css";
            link.rel = "stylesheet";
            document.head.appendChild(link);

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = `layx.min.js`;
            script.onerror = reject;
            script.onload = function () {
                resolve(window.layx)
            };
            document.head.appendChild(script)
        }
    })
}
