<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../assets/images/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item
          >
          <el-menu-item index="1-3"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 侧边栏用户信息 -->
        <div class="user-box">
          <img :src="user_pic" v-if="user_pic" />
          <img v-else src="../../assets/images/touxiang.jpg" />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 侧边栏导航菜单 -->
        <!-- @open	sub-menu 展开的回调 
             @close	sub-menu 收起的回调
             router 开启路由 index属性的值对应要切换的路由地址
        -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <template v-for="item in menus">
            <!-- 不包含子菜单的“一级菜单” -->
            <el-menu-item
              :index="item.indexPath"
              :key="item.indexPath"
              v-if="!item.children"
            >
              <i :class="item.icon"></i>{{ item.title }}
            </el-menu-item>

            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu :index="item.indexPath" :key="item.title" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <!-- 循环渲染“二级菜单” -->
              <el-menu-item
                :index="subItem.indexPath"
                v-for="subItem in item.children"
                :key="subItem.indexPath"
              >
                <i :class="subItem.icon"></i>{{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>文章管理后台系统---by Wang</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
  
  <script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "Layout",
  mounted() {
    this.$store.dispatch("getMenusListFn");
    this.$store.dispatch("getUserInfo");
  },
  methods: {
    //退出
    logoutFn() {
      //element-ui 提供确认消息
      this.$confirm("您确定要退出吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          //清空token
          this.$store.dispatch("clearToken");
          //跳转到登录页面
          this.$router.push("./login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
  computed: {
    ...mapGetters(["nickname", "username", "user_pic"]),
    ...mapState(["menus"]),
  },
};
</script>
  
  <style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
</style>