<template>
  <div>
    <a-comment v-if="showAddComment">
      <div slot="content">
        <a-form-item>
          <a-textarea :rows="5" v-model="newCommentData"></a-textarea>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :loading="loadingAdd" @click="handleCommentSubmit" type="primary">
            评论
          </a-button>
        </a-form-item>
      </div>
    </a-comment>
    <a-list
      :header="`${value.length} 评论`"
      itemLayout="horizontal"
      :dataSource="value"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-comment :author="item.fromUser.name">
          <template slot="actions">
            <span @click="handleReply">回复</span>
          </template>
          <p slot="content">{{item.comment}}</p>
          <a-tooltip slot="datetime" :title="moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')">
            <span>{{moment(item.gmtCreate).fromNow()}}</span>
          </a-tooltip>
        </a-comment>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import {Post} from "../http";
    import {API} from "../api";

    moment.locale('zh-cn');
    export default {
        props: ["value", "leaveId"],
        name: "Comment",
        data() {
            return {
                newCommentData: "",
                loadingAdd: false,
                showAddComment: false,
                moment
            }
        },
        methods: {
            handleCommentSubmit() {
                if (this.newCommentData.trim() === "") {
                    return;
                }
                this.loadingAdd = true;
                Post(API.leave_add_comment)
                    .withSuccessCode(201)
                    .withURLSearchParams({leaveId: this.leaveId, comment: this.newCommentData.trim()})
                    .do(response => {
                        this.value.unshift(response.data.data);
                    })
                    .doAfter(() => {
                        this.newCommentData = "";
                        this.showAddComment = false;
                        this.loadingAdd = false;
                    })
            },
            handleReply() {
                this.showAddComment = !this.showAddComment;
            }
        },
        mounted() {
            if (this.value.length === 0) {
                this.showAddComment = true;
            }
        }
    }
</script>

<style scoped>

</style>
