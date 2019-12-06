export default function videoLoader() {
    return new Promise((resolve, reject) => {
        if (window.videojs) {
            resolve(window.videojs)
        } else {
            var link = document.createElement("link");
            link.type = "text/css";
            link.href = "video-js.min.css";
            link.rel = "stylesheet";
            document.head.appendChild(link);

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = `video.min.js`;
            script.onerror = reject;
            script.onload = function () {
                resolve(window.videojs)
            };
            document.head.appendChild(script)
        }
    })
}
