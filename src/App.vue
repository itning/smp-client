<template>
  <a-locale-provider :locale="locale">
    <a-layout style="height: 100%">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed">
        <div class="logo-box">
          <img class="logo" :src="`${publicPath}logo.png`" alt="logo img"/>
        </div>
        <a-menu theme="dark" mode="inline" v-model="selectedMenuKeys">
          <a-menu-item key="all_student" @click="pushRouter('/student')">
            <a-icon type="profile"/>
            <span>学生查询</span>
          </a-menu-item>
          <a-menu-item key="review" @click="pushRouter('/new_student')">
            <a-icon type="plus"/>
            <span>新增学生</span>
          </a-menu-item>
          <a-menu-item key="plan_list" @click="pushRouter('/apartment')">
            <a-icon type="align-left"/>
            <span>公寓管理</span>
          </a-menu-item>
          <a-menu-item key="export" @click="pushRouter('/export')">
            <a-icon type="download"/>
            <span>请假查询</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
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
</template>
<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

    export default {
        name: 'App',
        data: () => ({
            publicPath: process.env.BASE_URL,
            locale: zhCN,
            //关闭菜单栏
            collapsed: false,
            //登录用户
            loginUser: '',
            //当前选中菜单
            selectedMenuKeys: ['all_student'],
        }),
        methods: {
            /**
             * 更改路由
             * @param path 路由路径
             */
            pushRouter(path) {
                this.$router.push(path);
            },
            /**
             * 注销登录
             */
            logout() {
                window.localStorage.removeItem('authorization_token');
                window.location.href = CAS_LOGOUT_URL;
            }
        },
        created() {

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

  .logo-box img {
    width: 180px;
  }

  /*用户操作按钮*/
  .user-btn {
    padding-right: 24px;
    float: right;
  }
</style>

<style>

</style>
