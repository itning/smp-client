<template>
  <div>
    <a-row>
      <a-col :span="8">
        <ve-liquidfill :data="roomComingStatisticsData.data"/>
      </a-col>
      <a-col :span="8">
        <ve-liquidfill :data="leaveStatisticsData.data"/>
      </a-col>
      <a-col :span="8">
        <ve-liquidfill :data="classComingStatisticsData.data"/>
      </a-col>
    </a-row>
    <a-row style="text-align: center;position: relative;bottom: 80px">
      <a-col :span="8">实时归寝率</a-col>
      <a-col :span="8">实时请假率</a-col>
      <a-col :span="8">实时出勤率</a-col>
    </a-row>
    <a-row>
      <a-col :span="16">
        <span style="margin-left: 10px">数据日期范围：</span>
        <a-range-picker style="margin-bottom: 16px"
                        @change="handleRangeDateChange"
                        :disabledDate="disabledDate"
                        :defaultValue="[moment(moment().subtract(1,'month').format('YYYY-MM-DD')), moment(moment().format('YYYY-MM-DD'))]"
                        format="YYYY-MM-DD"/>
      </a-col>
      <a-col :span="8"/>
    </a-row>
    <a-row>
      <a-col :span="12">
        <ve-line :data="chartData.data" :data-zoom="chartData.dataZoom" :settings="chartData.chartSettings"/>
      </a-col>
      <a-col :span="12">
        <!--公寓统计饼图-->
        <ve-pie :data="apartmentStatisticsData.data" :settings="apartmentStatisticsData.setting"/>
      </a-col>
    </a-row>
    <ve-bar :data="allStatisticsData.data" :settings="allStatisticsData.chartSettings"/>
  </div>
</template>

<script>
  import VeLine from 'v-charts/lib/line.common'
  import {Get} from "../http";
  import {API} from "../api";
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  import 'echarts/lib/component/dataZoom'

  moment.locale('zh-cn');

  export default {
    name: "First",
    components: {VeLine},
    data() {
      return {
        moment,
        roomComingStatisticsData: {
          data: {
            columns: ['name', 'percent'],
            rows: [{
              name: '归寝率',
              percent: 0
            }]
          }
        },
        leaveStatisticsData: {
          data: {
            columns: ['name', 'percent'],
            rows: [{
              name: '请假率',
              percent: 0
            }]
          }
        },
        classComingStatisticsData: {
          data: {
            columns: ['name', 'percent'],
            rows: [{
              name: '出勤率',
              percent: 0
            }]
          }
        },
        apartmentStatisticsData: {
          setting: {
            limitShowNum: 5
          },
          data: {
            columns: ['name', 'people'],
            rows: []
          }
        },
        chartData: {
          chartSettings: {
            labelMap: {
              'date': '日期',
              'room': '寝室归寝',
              'clazz': '课堂出勤',
              'leave': '请假'
            }
          },
          dataZoom: [
            {
              type: 'slider',
              // 开始位置百分比
              start: 0,
              // 结束位置百分比
              end: 100
            }
          ],
          data: {
            columns: ['date', 'clazz', 'room', 'leave'],
            rows: []
          }
        },
        allStatisticsData: {
          chartSettings: {
            labelMap: {
              'name': '导员',
              'room': '寝室归寝',
              'clazz': '课堂出勤',
              'leave': '请假'
            }
          },
          data: {
            columns: ['name', 'room', 'clazz', 'leave'],
            rows: []
          }
        }
      }
    },
    methods: {
      handleRangeDateChange(date, dateStr) {
        console.log("日期改变：" + dateStr.join(","));
        if (dateStr[0] === "" || dateStr[1] === "") {
          this.initCounselorAllChart();
          this.initPolylineData();
        } else {
          this.initCounselorAllChart(dateStr[0], dateStr[1]);
          this.initPolylineData(dateStr[0], dateStr[1]);
        }
      },
      disabledDate(current) {
        return current > moment().endOf('day');
      },
      /**
       * 各寝人数
       */
      initApartmentChart() {
        Get(API.statistics_apartment)
          .do(response => {
            this.apartmentStatisticsData.data.rows = response.data.data;
          })
      },
      /**
       * 归寝率
       */
      initHomeComingChart() {
        Get(API.statistics_home_coming + "?date=" + moment(new Date()).format("YYYY-MM-DD"))
          .do(response => {
            if (response.data.data.sum === 0) {
              this.roomComingStatisticsData.data.rows[0].percent = 0;
              return;
            }
            this.roomComingStatisticsData.data.rows[0].percent = response.data.data.coming / response.data.data.sum;
          })
      },
      /**
       * 请假率
       */
      initLeaveChart() {
        Get(API.statistics_leave + "?date=" + moment(new Date()).format("YYYY-MM-DD"))
          .do(response => {
            if (response.data.data.sum === 0) {
              this.leaveStatisticsData.data.rows[0].percent = 0;
              return;
            }
            this.leaveStatisticsData.data.rows[0].percent = response.data.data.leave / response.data.data.sum;
          })
      },
      /**
       * 出勤率
       */
      initClassComingChart() {
        Get(API.statistics_class_coming + "?date=" + moment(new Date()).format("YYYY-MM-DD"))
          .do(response => {
            if (response.data.data.sum === 0) {
              this.classComingStatisticsData.data.rows[0].percent = 0;
              return;
            }
            this.classComingStatisticsData.data.rows[0].percent = response.data.data.coming / response.data.data.sum;
          })
      },
      /**
       * 各辅导员统计
       */
      initCounselorAllChart(startDate = moment().subtract(1, 'month').format('YYYY-MM-DD'),
                            endDate = moment().format('YYYY-MM-DD')) {
        Get(`${API.statistics_all_counselor}?startDate=${startDate}&endDate=${endDate}`)
          .do(response => {
            this.allStatisticsData.data.rows = response.data.data.map(d => {
              return {
                name: d.user.name,
                clazz: this.percentage(d.classComing.coming, d.classComing.sum),
                room: this.percentage(d.homeComing.coming, d.homeComing.sum),
                leave: this.percentage(d.leave.leave, d.leave.sum)
              }
            });
          })
      },
      initPolylineData(startDate = moment().subtract(1, 'month').format('YYYY-MM-DD'),
                       endDate = moment().format('YYYY-MM-DD')) {
        this.chartData.data.rows = [];
        const startDateMoment = moment(startDate);
        const endDateMoment = moment(endDate);
        const days = endDateMoment.diff(startDateMoment, 'days') + 1;
        for (let i = 0; i < days; i++) {
          let date = moment(startDateMoment.format("YYYY-MM-DD")).add(i, 'days').format("YYYY-MM-DD");
          this.chartData.data.rows.push({'date': date, clazz: 0, room: 0, leave: 0});
          fetchUrl(date, this.chartData.data.rows[i], this, i);
        }

        function fetchUrl(date, obj, that, index) {
          Get(API.statistics_home_coming + "?date=" + date)
            .do(response => {
              obj.room = that.percentage(response.data.data.coming, response.data.data.sum);
              that.$set(that.chartData.data.rows, index, obj);
            });
          Get(API.statistics_leave + "?date=" + date)
            .do(response => {
              obj.leave = that.percentage(response.data.data.leave, response.data.data.sum);
              that.$set(that.chartData.data.rows, index, obj);
            });
          Get(API.statistics_class_coming + "?date=" + date)
            .do(response => {
              obj.clazz = that.percentage(response.data.data.coming, response.data.data.sum);
              that.$set(that.chartData.data.rows, index, obj);
            });
        }
      },
      percentage(now, sum) {
        if (sum === 0) {
          return 0;
        }
        return (now / sum) * 100;
      }
    },
    created() {
      this.initPolylineData();
      this.initApartmentChart();
      this.initHomeComingChart();
      this.initLeaveChart();
      this.initClassComingChart();
      this.initCounselorAllChart();
    }
  }
</script>

<style scoped>

</style>
