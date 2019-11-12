// vue.config.js
module.exports = {
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    'primary-color': '#FF4081',
                    'link-color': '#FF4081',
                    'border-radius-base': '2px',
                },
                javascriptEnabled: true
            }
        }
    }
};