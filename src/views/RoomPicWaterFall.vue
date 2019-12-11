<template>
  <div>
    <a-back-top :target="backTopTarget"/>
    <a-empty v-if="data.length===0">
      <span slot="description">好像没有同学打卡</span>
      <a-button type="primary">
        <router-link to="/room">返回归寝管理</router-link>
      </a-button>
    </a-empty>
    <Waterfall
      id="aaa"
      :list="data"
      :gutter="10"
      :width="240"
      :phoneCol="4"
      @handleClick="handleClick"
      backgroundColor="#f0f2f5"
      ref="waterfall"
    >
      <template slot="item" slot-scope="props">
        <div class="card">
          <div class="cover"><img :src="waterfallSrc(props.data)" style="width: 100%" alt=""
                                  @load="$refs.waterfall.refresh()"></div>
          <div class="name">
            <p>
              {{props.data.user.name}}（{{props.data.user.studentUser.studentId}}）{{Number(props.data.checkFaceSimilarity
              * 100).toFixed(3)}}</p>
            <p>{{props.data.user.studentUser.apartment.name}} {{props.data.checkTime}}</p>
          </div>
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<script>
  import Waterfall from "vue-waterfall-plugin";
  import {SERVER_HOST} from "../api";

  export default {
    name: "RoomPicWaterFall",
    components: {Waterfall},
    data() {
      return {
        data: []
      }
    },
    computed: {
      waterfallSrc() {
        return function (obj) {
          return `${SERVER_HOST}/room/check_image/${obj.id}.${obj.filenameExtension}`
        }
      }
    },
    methods: {
      backTopTarget() {
        return window.document.getElementsByClassName('ant-layout')[1];
      },
      handleClick(obj) {
        this.$notification['info']({
          message: '学生信息',
          description: function (h) {
            const name = h("div", `姓名：${obj.user.name}`);
            const studentId = h("div", `学号：${obj.user.studentUser.studentId}`);
            const apartment = h("div", `公寓：${obj.user.studentUser.apartment.name}`);
            const checkTime = h("div", `打卡时间：${obj.checkTime}`);
            const checkFaceSimilarity = h("div", `相似度：${Number(obj.checkFaceSimilarity * 100).toFixed(3)}%`);
            const faceImg = h('img', {
              attrs: {
                src: `${SERVER_HOST}/room/face_image/${obj.user.id}`
              }
            });
            return h("div", [name, studentId, apartment, checkTime, checkFaceSimilarity, faceImg])
          },
        });
      }
    },
    created() {
      this.data = this.$store.getters.studentRoomCheckData;
    }
  }
</script>

<style scoped>
  .card {
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    transition: .2s;
    top: 0
  }

  .card:hover {
    top: -3px;
  }

  .card .cover {
    padding: 10px 10px 0 10px;
    line-height: 0;
  }

  .card .name {
    background: #fff;
    color: #666;
    font-weight: 600;
    padding: 10px 20px;
    font-size: 14px;
  }
</style>
