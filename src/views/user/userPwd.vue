<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <el-form
      :model="pwdForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      ref="pwdForm"
    >
      <el-form-item label="原密码" prop="oldPwd">
        <el-input v-model="pwdForm.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input  v-model="pwdForm.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="rePwd">
        <el-input  v-model.number="pwdForm.rePwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateFn">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Userpwd",
  data() {
    //建议新旧密码是否一样
    const samePwd=(rule,value,callback)=>{
        if(value===this.pwdForm.oldPwd){
            return callback(new Error('新密码不能与旧密码相同'))
        }
        callback()
    }
    // 检测两次新密码是否一致
    const rePwd = (rule, value, callback) => {
    if (value != this.pwdForm.newPwd) {
      return callback(new Error('两次新密码不一致！'))
    }
    callback()
  }

    return {
      //表单数据
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        rePwd: '',
      },
      //表单验证规则
      rules: {
        oldPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码长度必须是6-15位的非空字符串",
            trigger: "change",
          },
        ],
        newPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码长度必须是6-15位的非空字符串",
            trigger: "change",
          },
          { validator: samePwd, trigger: 'blur' }
        ],
        rePwd: [
        { required: true, message: '请再次确认新密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
        { validator: rePwd, trigger: 'blur' }
        ],
      },
    };
  },
  methods:{
    //提交更新密码
    updateFn(){
        this.$refs.pwdForm.validate( async (valid)=>{
         if(!valid) return false // 未通过校验拦住
         const {data:res}=await this.$API.updatePwdAPI(this.pwdForm)
         if(res.status!==200) {
            //重置表单
            this.$refs.pwdForm.resetFields()
            return this.$message.error(res.message)
        }
         this.$message.success('更新密码成功！')
         //重置表单
         this.$refs.pwdForm.resetFields()
        })
    },
    //重置
    resetForm() {
        this.$refs.pwdForm.resetFields();
      }
  }
};
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>