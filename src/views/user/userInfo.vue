<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="userForm"
      :rules="userFormRules"
      ref="userFormRef"
      label-width="100px"
    >
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="userForm.nickname"
          minlength="1"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFn">提交修改</el-button>
        <el-button @click="clearFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "userInfo",
  data() {
    return {
      userForm: {
        username: this.$store.state.userInfo.username,
        nickname: this.$store.state.userInfo.nickname,
        email: this.$store.state.userInfo.email,
      },
      //表单验证规则
      userFormRules: {
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            pattern: /^\S{1,10}$/,
            message: "昵称必须是1-10位的非空字符串",
            trigger: "change",
          },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    //提交修改
    submitFn() {
      this.$refs.userFormRef.validate(async (valid) => {
        if (valid) {
          //验证成功
          // 根据接口文档指示, 需要携带id(必须)
          this.userForm.id = this.$store.state.userInfo.id;
          // 调用更新用户基本信息接口, 把用户在页面输入的新内容传给后台保存
          const { data: res } = await this.$API.updateUserInfoAPI( this.userForm);
          if(res.status===200){
            this.$message.success('修改用户信息成功')
            //更新用户信息成功，刷新 Vuex 中的数据
            this.$store.dispatch('getUserInfo')
          }else{
            this.$message.error('更新用户信息失败')
          }
        } else {
          return false;
        }
      });
    },
    //重置
    clearFn(){
      //这样无法去掉element表单的报错提示
      // this.userForm.nickname=''
      // this.userForm.email=''

      //element-ui自带(重置报错提示)
      this.$refs.userFormRef.resetFields()
      this.userForm.nickname=''
      this.userForm.email=''
    }
  },
};
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
