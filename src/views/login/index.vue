<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form :model="loginForm" :rules="rules" ref="loginRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginFn"
            >登录</el-button
          >
          <el-link type="info" @click="goRegister">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

  
  <script>
export default {
  name: "my-login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      //表单规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10的字母数字",
            trigger: "change",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted(){
    console.log(this.$store);
  },
  methods: {
    //跳转注册页面
    goRegister() {
      this.$router.push("/register");
    },
    //登录按钮
    loginFn() {
      this.$refs.loginRef.validate( async (valid) => {
        if (!valid) return false;
        //调用登录接口
        let { data: res } = await this.$API.loginAPI(this.loginForm);
        //登录失败
        if(res.status!=200) return this.$message.error(res.message)
        //登录成功
        this.$message.success(res.message)
        //将token保存到vuex
        this.$store.dispatch('setOrUpdateToken',res.token)
        this.$router.push('/')
      });
    },
  },
};
</script>
  
  <style lang="less" scoped>
.login-container {
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url("../../assets/images/login_title.png") center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>