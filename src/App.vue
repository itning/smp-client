<template>
  <div style="height: 100%">
    <a-locale-provider :locale="locale">
      <a-layout style="height: 100%">
        <a-layout-sider :trigger="null" collapsible v-model="collapsed" v-if="show">
          <div class="logo-box">
            <img v-show="!collapsed" class="logo" :src="`${publicPath}logo.png`" alt="logo img"/>
            <img v-show="collapsed" class="logo-small" :src="`${publicPath}logo-small.png`" alt="logo img"/>
          </div>
          <a-menu theme="dark" mode="inline" v-model="selectedMenuKeys">
            <a-menu-item key="first" @click="pushRouter('/first')">
              <a-icon type="pie-chart"/>
              <span>首页</span>
            </a-menu-item>
            <a-menu-item key="student" @click="pushRouter('/student')">
              <a-icon type="profile"/>
              <span>学生管理</span>
            </a-menu-item>
            <a-menu-item key="new_student" @click="pushRouter('/new_student')">
              <a-icon type="plus"/>
              <span>新增学生</span>
            </a-menu-item>
            <a-menu-item key="apartment" @click="pushRouter('/apartment')">
              <a-icon type="align-left"/>
              <span>公寓管理</span>
            </a-menu-item>
            <a-menu-item key="leave" @click="pushRouter('/leave')">
              <a-icon type="search"/>
              <span>请假查询</span>
            </a-menu-item>
            <a-menu-item key="leave_check" @click="pushRouter('/leave_check')">
              <a-icon type="tags"/>
              <span>请假审批</span>
            </a-menu-item>
            <a-menu-item key="room" @click="pushRouter('/room')">
              <a-icon type="home"/>
              <span>归寝管理</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header style="background: #fff; padding: 0" v-if="show">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="()=> collapsed = !collapsed"
            />
            <a-dropdown class="user-btn">
              <a class="ant-dropdown-link">
                {{loginUser}}
                <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a>{{$user.loginName}}</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="showChangePwdModel=true">修改密码</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="logout">注销登录</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-layout-header>
          <a-layout-content>
            <router-view/>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-locale-provider>
    <a-modal title="修改密码" v-model="showChangePwdModel" :confirmLoading="confirmLoading"
             @ok="handleChangePwd" okText="修改" cancelText="取消">
      <a-input-password placeholder="新密码" v-model="newPwd"/>
    </a-modal>
  </div>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import {Post} from "./http";
  import {API} from "./api";

  export default {
    name: 'App',
    data: () => ({
      show: true,
      publicPath: process.env.BASE_URL,
      locale: zhCN,
      //关闭菜单栏
      collapsed: false,
      //登录用户
      loginUser: '',
      //当前选中菜单
      selectedMenuKeys: ['first'],
      showChangePwdModel: false,
      confirmLoading: false,
      newPwd: ''
    }),
    methods: {
      /**
       * 更改路由
       * @param path 路由路径
       */
      pushRouter(path) {
        if (this.$route.path === path) {
          return;
        }
        this.$router.push(path);
      },
      /**
       * 注销登录
       */
      logout() {
        window.localStorage.removeItem('authorization_token');
        this.$router.push("/security");
      },
      handleChangePwd() {
        if (this.newPwd.trim() === "") {
          this.$message.error('请输入新密码');
          return;
        }
        this.confirmLoading = true;
        Post(API.change_password)
          .withURLSearchParams({newPassword: this.newPwd})
          .withSuccessCode(204)
          .do(response => {
            this.newPwd = "";
            this.showChangePwdModel = false;
            this.$message.success('修改成功');
            this.logout();
          })
          .doAfter(() => {
            this.confirmLoading = false;
          })
      }
    },
    created() {
      this.$store.watch((state, getters) => state.now_path, (value, oldValue) => {
        if (value === '/security') {
          this.show = false;
        } else {
          this.show = true;
          this.selectedMenuKeys = [value.replace(/[^a-zA-Z_]/g, '')];
        }
      });
    }
  }
</script>
<style scoped>
  /*调整菜单栏开关按钮位置和鼠标样式*/
  .trigger {
    padding: 20px;
    cursor: pointer;
  }

  /*logo盒子*/
  .logo-box {
    padding: 0 10px;
    line-height: 64px;
    height: 64px;
    overflow: hidden;
  }

  .logo {
    width: 180px;
  }

  .logo-small {
    position: relative;
    width: 36px;
    left: 12px;
  }

  /*用户操作按钮*/
  .user-btn {
    padding-right: 24px;
    float: right;
  }
</style>

<style>

</style>
