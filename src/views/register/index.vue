<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form :model="regForm" :rules="rules" ref="regRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="regForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="regForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input
            v-model="regForm.repassword"
            type="password"
            placeholder="请再次确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="registerFn"
            >注册</el-button
          >
          <el-link type="info" @click="goLogin">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-register",
  data() {
    //自定义校验规则
    const samePwdFn = (rule, value, callback) => {
      //判断密码是否相等
      if (this.regForm.password === value) {
        callback();
      } else {
        callback(new Error("输入的密码不一致"));
      }
    };
    return {
      //表单数据
      regForm: {
        username: "", //用户名
        password: "", //密码
        repassword: "", //确认密码
      },
      //表单验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10的大小写字母数字",
            trigger: "change",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "change",
          },
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: samePwdFn, trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    console.log(this.$API);
  },
  methods: {
    //注册--点击事件
    registerFn() {
      this.$refs.regRef.validate(async (valid) => {
        if (!valid) return false;
        //1.调用注册接口
        let { data: res } = await this.$API.registerAPI(this.regForm);
        // 2. 注册失败，提示用户
        // element-ui在vue上添加了$message作为弹窗提示
        if (res.status !== 200) return this.$message.error(res.message);
        // 3. 注册成功，提示用户
        this.$message.success(res.message);
        // 4. 跳转到登录页面
        this.$router.push("/login");
      });
    },
    //跳转登录页面
    goLogin(){
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="less" scoped>
.reg-container {
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
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

    .btn-reg {
      width: 100%;
    }
  }
}
</style>