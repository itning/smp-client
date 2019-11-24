<template>
  <div>
    <a-button class="edit_btn" type="primary" @click="polyEditor.open()" style="margin-bottom: 5px">开始编辑</a-button>
    <a-button class="edit_btn" type="primary" @click="polyEditor.close()">结束编辑</a-button>
    <a-button class="edit_btn" type="primary" @click="setFitView(false)">缩放以适合标记</a-button>
    <a-button class="edit_btn" type="primary" @click="setFitView(true)">缩放以适合范围</a-button>
    <div id="js-container"></div>
  </div>
</template>

<script>
    import MapLoader from '../http/mapLoader'
    import {Get} from "../http";
    import {API, SERVER_HOST} from "../api";
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import layxLoader from "../http/layxLoader";

    moment.locale('zh-cn');

    export default {
        name: "VueAmap",
        data() {
            return {
                layx: null,
                AMap: null,
                AMapInstance: null,
                polyEditor: null,
                polygon: null,
                studentRoomCheckData: []
            }
        },
        methods: {
            initMap(AMap, that) {
                let map = that.AMapInstance = new AMap.Map("js-container", {
                    center: [127.21220960201039, 45.74218945848489],
                    zoom: 15
                });

                let path = [
                    [127.210157, 45.743361],
                    [127.213485, 45.74255],
                    [127.21364, 45.739923],
                    [127.209396, 45.740759]
                ];

                let polygon = that.polygon = new AMap.Polygon({
                    path: path,
                    strokeColor: "#FF33FF",
                    strokeWeight: 6,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                    zIndex: 50,
                });

                map.add(polygon);
                // 缩放地图到合适的视野级别
                // map.setFitView([polygon]);
                map.setFitView();

                let polyEditor = new AMap.PolyEditor(map, polygon);
                that.polyEditor = polyEditor;
                polyEditor.on('addnode', function (event) {
                    console.log('触发事件：addnode')
                });

                polyEditor.on('adjust', function (event) {
                    console.log('触发事件：adjust')
                });

                polyEditor.on('removenode', function (event) {
                    console.log('触发事件：removenode')
                });

                polyEditor.on('end', function (event) {
                    console.log('触发事件： end ' + event.target)
                    // event.target 即为编辑后的多边形对象
                });
            },
            setFitView(isPolygon) {
                if (isPolygon) {
                    this.AMapInstance.setFitView([this.polygon]);
                } else {
                    this.AMapInstance.setFitView();
                }
            },
            initData() {
                let thisDay = moment(new Date()).format("YYYY-MM-DD");
                Get(API.check_all + "?whereDay=" + thisDay)
                    .do(response => {
                        this.studentRoomCheckData = response.data.data.map(item => {
                            item.checkTime = moment(item.checkTime).format("YYYY年MM月DD日 HH:mm:ss");
                            return item;
                        });
                        this.initMarker();
                    });
            },
            initMarker() {
                const AMap = this.AMap;
                const AMapInstance = this.AMapInstance;
                this.studentRoomCheckData.forEach(item => {
                    let marker = new AMap.Marker({
                        map: AMapInstance,
                        position: [item.longitude, item.latitude],
                        topWhenClick: true,
                        extData: item,
                        animation: "AMAP_ANIMATION_DROP"
                    });

                    AMap.event.addListener(marker, 'click', (e) => {
                        const data = e.target.getExtData();

                        function wrapItem(content) {
                            return `<p>${content}</p>`
                        }

                        function wrap() {
                            let obj = {
                                "姓名": data.user.name,
                                "学号": data.user.studentUser.studentId,
                                "公寓": data.user.studentUser.apartment.name,
                                "打卡时间": data.checkTime
                            };
                            let s = "";
                            for (let o in obj) {
                                s += wrapItem(o + "：" + obj[o]);
                            }
                            return s;
                        }

                        let infoWindow = new AMap.InfoWindow({
                            content: wrap(),
                            offset: new AMap.Pixel(1, -30)
                        });

                        infoWindow.on("open", () => {
                            const name = `${data.user.name}（${data.user.studentUser.studentId}）`;
                            this.layx.html(data.user.studentUser.studentId, name, `<img style="width:100%" src="${SERVER_HOST}/room/check_image/${data.id}.jpg"/>`, {
                                width: 300,
                                height: 600,
                                maxable: false,
                                maxMenu: false,
                                isOverToMax: false,
                                type: 'html',
                                storeStatus: false,
                                position: [100, 100],
                                closeMenu: false
                            });
                        });
                        infoWindow.on("close", () => {
                            this.layx.destroy(data.user.studentUser.studentId);
                        });
                        infoWindow.open(AMapInstance, e.target.getPosition());

                    })
                })
            }
        },
        mounted() {
            let that = this;
            layxLoader().then(layx => {
                that.layx = layx;
                console.log('layx加载成功');
            }, e => {
                console.log('layx加载失败', e)
            });
            MapLoader().then(AMap => {
                console.log('地图加载成功');
                that.AMap = AMap;
                that.initMap(AMap, that);
                that.initData();
            }, e => {
                console.log('地图加载失败', e)
            });
        },
        destroyed() {
            this.layx.destroyAll();
        }
    }
</script>

<style scoped>
  .edit_btn {
    margin-left: 6px;
    margin-right: 6px;
  }

  #js-container {
    height: 500px;
  }
</style>
