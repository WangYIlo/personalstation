<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <!-- 图片，用来展示用户选择的头像 -->
    <!-- 没有设置图片 -->
    <img
      v-if="!avatar"
      class="the_img"
      src="../../assets/images/avatar.jpg"
      alt=""
    />
    <!-- 设置图片 -->
    <img v-else class="the_img" :src="avatar" alt="" />

    <!-- 按钮区域 -->
    <div class="btn-box">
      <!-- input默认隐藏，当点击选择图片按钮触发方法 -->
      <input
        type="file"
        accept="image/*"
        style="display: none"
        ref="iptRef"
        @change="onFileChange"
      />
      <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
        >选择图片</el-button
      >
      <el-button
        type="success"
        icon="el-icon-upload"
        :disabled="avatar === ''"
        @click="uploadAvatar"
        >上传头像</el-button
      >
    </div>
  </el-card>
</template>

<script>
export default {
  name: "UserAvatar",
  data() {
    return {
      avatar: "", //保存图片链接或者base64字符串
    };
  },
  methods: {
    //选择图片-->点击事件
    chooseImg() {
      //目的:为了触发input[typr=file]点击事件
      //触发input点击事件
      this.$refs.iptRef.click();
    },
    //选择图片
    onFileChange(e) {
      let files = e.target.files; //拿到用户选择的文件
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = "";
      } else {
        // 选择了图片--img中的src值1.图片链接地址2.图片的base64字符串
        //1.创建FileReader对象
        const fr = new FileReader();
        //2.调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0]);
        //3.监听fr的onload事件
        fr.onload = (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.avatar = e.target.result;
        };
      }
    },
    //上传图片
    async uploadAvatar() {
      //发送请求,调用接口更改后台头像数据
      let res = await this.$API.updateAvatarAPI(this.avatar);
      if (res.status !== 200) return this.$message.error("上传头像失败！");
      this.$message.success("上传头像成功");
      //重新获取用户信息
      this.$store.dispatch("getUserInfo");
    },
  },
};
</script>
    
<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>