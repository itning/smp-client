<template>
  <div>
    <video id="video-id" muted="true"
           loop="loop" meted="meted"
           style="height: 100%;width: 100%;position: fixed;object-fit: fill;top:0;">
      <source src="/video/video.m3u8" type="application/x-mpegURL">
    </video>
    <div class="security_box">
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
          'username',
          { rules: [{ required: true, message: '请输入你的用户名！' }] },
        ]"
            placeholder="用户名"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入你的密码！' }] },
        ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button" :loading="isLoginLoading" block>
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
  import {Post} from "../http";
  import {API} from "../api";
  import {LOCAL_STORAGE_KEY} from "../user";
  import videoLoader from "../http/videoLoader";

  export default {
    name: "Security",
    data() {
      return {
        isLoginLoading: false
      }
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.isLoginLoading = true;
            console.log('Received values of form: ', values);
            Post(API.login)
              .withURLSearchParams({username: values.username, password: values.password})
              .withOnceErrorToast(true)
              .do(response => {
                console.log("get token: " + response.data.data);
                window.localStorage.setItem(LOCAL_STORAGE_KEY, response.data.data);
                if (!this.$user.isCounselorLogin()) {
                  this.$message.error('请使用辅导员账户进行登录！');
                  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
                  return;
                }
                window.location.href = window.location.protocol + '//' + window.location.host;
              })
              .doAfter(() => {
                this.isLoginLoading = false;
              })
          }
        });
      },
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'normal_login'});
    },
    created() {
      videoLoader().then(videojs => {
        console.log('videojs加载状态：' + (videojs !== undefined));
        videojs('video-id', {
          fill: true,
          controls: false,
          autoplay: true,
          preload: 'auto'
        }).ready(function () {
          console.log("ready");
          this.play();
        });
      }, e => {
        console.log('videojs加载失败', e)
      });
    }
  }
</script>

<style scoped>
  .security_box {
    max-width: 400px;
    margin: 200px auto;
  }
</style>
