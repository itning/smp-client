<template>
  <div style="background-color: #ffffff">
    <div style="padding: 16px 36px">
      <a-row type="flex" justify="center" align="middle">
        <a-col :span="8" style="text-align: center;" @click="roomCheckModalVisible = true">
          <a-statistic style="cursor: pointer" title="每天打卡时间" :value="checkTime"/>
        </a-col>
        <a-col :span="8" style="text-align: center;">
          <a-statistic-countdown title="距离打卡时间还有" :value="moment(checkTime, 'HH:mm')"/>
        </a-col>
        <a-col :span="8" style="text-align: center;">
          <a-popover title="数值统计">
            <template slot="content">
              <p>学生总数：{{countStudent}}</p>
              <p>请假人数：{{countInEffectLeaves}}</p>
            </template>
            <div>
              <a-statistic title="打卡人数" :value="studentRoomCheckData.length">
                <template v-slot:suffix>
                  <span> / {{totalStudentNum}}</span>
                </template>
              </a-statistic>
            </div>
          </a-popover>
        </a-col>
      </a-row>
    </div>
    <div style="text-align: center">
      <a-button class="edit_btn" @click="polyEditor.open()" style="margin-bottom: 5px">开始编辑</a-button>
      <a-button class="edit_btn" @click="polyEditor.close()">结束编辑</a-button>
      <a-button class="edit_btn" @click="setFitView(false)">缩放以适合标记</a-button>
      <a-button class="edit_btn" @click="setFitView(true)">缩放以适合范围</a-button>
      <a-tooltip placement="top">
        <template slot="title">
          <span>更改查询日期</span>
        </template>
        <a-date-picker class="edit_btn" :disabledDate="disabledDate" @change="handleNowDataChange"
                       :defaultValue="moment(new Date())"/>
      </a-tooltip>
      <a-modal title="更改寝室打卡时间" v-model="roomCheckModalVisible" @ok="handleCheckTimeChangeOk">
        <a-time-picker :defaultValue="moment(checkTime, 'HH:mm')" @change="(a,b)=>changeCheckTime=b" format="HH:mm"/>
      </a-modal>
    </div>
    <div id="js-container"></div>
    <Waterfall
      :list="studentRoomCheckData"
      :gutter="10"
      :width="240"
      :phoneCol="2"
      @handleClick="handleClick"
      ref="waterfall"
    >
      <template slot="item" slot-scope="props">
        <div class="card">
          <img :src="waterfallSrc(props.data.id)" style="width: 100%" alt="" @load="$refs.waterfall.refresh()">
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<script>
    import MapLoader from '../http/mapLoader'
    import {Get, Post} from "../http";
    import {API, SERVER_HOST} from "../api";
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import layxLoader from "../http/layxLoader";
    import Waterfall from "vue-waterfall-plugin";

    moment.locale('zh-cn');
    export default {
        name: "Room",
        components: {Waterfall},
        data() {
            return {
                roomCheckModalVisible: false,
                layx: null,
                AMap: null,
                AMapInstance: null,
                polyEditor: null,
                polygon: null,
                studentRoomCheckData: [],
                nowMarkers: [],
                checkTime: "20:30",
                changeCheckTime: this.checkTime,
                totalStudentNum: 0,
                countStudent: 0,
                countInEffectLeaves: 0
            }
        },
        computed: {
            waterfallSrc() {
                return function (id) {
                    return `${SERVER_HOST}/room/check_image/${id}.jpg`
                }
            }
        },
        methods: {
            moment,
            handleClick(obj) {
                this.$notification['info']({
                    message: '学生信息',
                    description: function (h) {
                        const name = h("div", `姓名：${obj.user.name}`);
                        const studentId = h("div", `学号：${obj.user.studentUser.studentId}`);
                        const apartment = h("div", `公寓：${obj.user.studentUser.apartment.name}`);
                        const checkTime = h("div", `打卡时间：${obj.checkTime}`);
                        return h("div", [name, studentId, apartment, checkTime])
                    },
                });
            },
            disabledDate(current) {
                return current && current > moment().endOf('day');
            },
            handleCheckTimeChangeOk() {
                this.roomCheckModalVisible = false;
                console.log(this.changeCheckTime);
                Post(API.check_date)
                    .withSuccessCode(201)
                    .withURLSearchParams({dateString: this.changeCheckTime})
                    .do(response => {
                        this.checkTime = response.data.data;
                        this.changeCheckTime = response.data.data;
                    })
            },

            handleNowDataChange(date, dateString) {
                this.initData(dateString);
            },
            initPolygon() {
                Get(API.gps_range)
                    .do(response => {
                        console.log();
                        /*let path = [
                            [127.210157, 45.743361],
                            [127.213485, 45.74255],
                            [127.21364, 45.739923],
                            [127.209396, 45.740759]
                        ];*/
                        let path = response.data.data;

                        let polygon = this.polygon = new AMap.Polygon({
                            path: path,
                            strokeColor: "#FF33FF",
                            strokeWeight: 6,
                            strokeOpacity: 0.2,
                            fillOpacity: 0.4,
                            fillColor: '#1791fc',
                            zIndex: 50,
                        });

                        this.AMapInstance.add(polygon);
                        this.AMapInstance.setFitView();

                        let polyEditor = new AMap.PolyEditor(this.AMapInstance, polygon);
                        this.polyEditor = polyEditor;

                        polyEditor.on('addnode', function (event) {
                            console.log('触发事件：addnode')
                        });

                        polyEditor.on('adjust', function (event) {
                            console.log('触发事件：adjust')
                        });

                        polyEditor.on('removenode', function (event) {
                            console.log('触发事件：removenode')
                        });

                        polyEditor.on('end', (event) => {
                            console.log('触发事件： end ' + event.target);
                            // event.target 即为编辑后的多边形对象
                            Post(API.gps_range)
                                .withSuccessCode(201)
                                .withURLSearchParams({gps: event.target})
                                .do(response => {
                                    this.$message.success('修改成功');
                                })
                        });
                    });
            },
            initMap(AMap, that) {
                that.AMapInstance = new AMap.Map("js-container", {
                    center: [127.21220960201039, 45.74218945848489],
                    zoom: 15
                });
                that.initPolygon();
                // 缩放地图到合适的视野级别
                // map.setFitView([polygon]);
            },
            setFitView(isPolygon) {
                if (isPolygon) {
                    this.AMapInstance.setFitView([this.polygon]);
                } else {
                    this.AMapInstance.setFitView();
                }
            },
            initData(whereDay = moment(new Date()).format("YYYY-MM-DD")) {
                console.log("数据初始化：" + whereDay);
                Get(API.check_all + "?whereDay=" + whereDay)
                    .do(response => {
                        this.studentRoomCheckData = response.data.data.map(item => {
                            item.checkTime = moment(item.checkTime).format("YYYY年MM月DD日 HH:mm:ss");
                            return item;
                        });
                        this.initMarker();
                    });
            },
            initCheckDate() {
                Get(API.check_date)
                    .do(response => {
                        let date = moment(response.data.data).format("HH:mm");
                        this.checkTime = date;
                        this.changeCheckTime = date;
                    })
            },
            initCountShouldRoomCheck() {
                Get(API.countShouldRoomCheck)
                    .do(response => {
                        this.countStudent = response.data.data.t1;
                        this.countInEffectLeaves = response.data.data.t2;
                        this.totalStudentNum = this.countStudent - this.countInEffectLeaves;
                    })
            },
            initMarker() {
                const AMap = this.AMap;
                const AMapInstance = this.AMapInstance;
                AMapInstance.remove(this.nowMarkers);
                this.studentRoomCheckData.forEach(item => {
                    let marker = new AMap.Marker({
                        map: AMapInstance,
                        position: [item.longitude, item.latitude],
                        topWhenClick: true,
                        extData: item,
                        animation: "AMAP_ANIMATION_DROP"
                    });
                    this.nowMarkers.push(marker);
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
            this.initCheckDate();
            this.initCountShouldRoomCheck();
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
    height: 575px;
  }
</style>
