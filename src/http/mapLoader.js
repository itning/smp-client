import {API} from "../api";

export default function MapLoader() {   // <-- 原作者这里使用的是module.exports
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            // 执行callback=initAMap
            script.src = `http://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=${API.aMapKey}&plugin=AMap.PolyEditor`;
            script.onerror = reject;
            document.head.appendChild(script)
        }
        window.initAMap = () => {
            resolve(window.AMap)
        }
    })
}
