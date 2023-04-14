<template>
  <div>
    <!-- 预览文章分类 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogBtnFn()"
          >添加分类</el-button
        >
      </div>
      <!-- 分类数据表格 -->
      <el-table :data="cateList" style="width: 100%" border stripe>
        <el-table-column
          label="序号"
          width="100"
          type="index"
        ></el-table-column>
        <el-table-column label="分类名称" prop="name"></el-table-column>
        <el-table-column label="分类别名" prop="alias"></el-table-column>
        <el-table-column label="操作">
          <!-- scope对象：{row:行对象} -->
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              @click="updateCateFn(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="removeFn(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加文章分类对话框 -->
    <el-dialog
      :title="isEdit ? '编辑文章分类' : '添加文章分类'"
      :visible.sync="dialogVisible"
      @close="dialogCloseFn"
      width="30%"
    >
      <!-- 添加的表单 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            v-model="addForm.cate_name"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            v-model="addForm.cate_alias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ArtCate",
  data() {
    return {
      //文章分类数据
      cateList: [],
      dialogVisible: false, // 添加分类-对话框是否显示
      isEdit: false, //修改按钮状态
      eidtId: "", //保存修改数据的id值
      // 表单的数据
      addForm: {
        // 添加表单的数据对象
        cate_name: "",
        cate_alias: "",
      },
      // 表单的验证规则
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            pattern: /^\S{1,10}$/,
            message: "分类名必须是1-10位的非空字符",
            trigger: "blur",
          },
        ],
        cate_alias: [
          { required: true, message: "请输入分类别名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: "分类别名必须是1-15位的字母数字",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getArtCateList();
  },
  methods: {
    //获取文章分类
    async getArtCateList() {
      const { data: res } = await this.$API.getArtCateAPI();
      this.cateList = res.data;
    },
    //添加分类按钮点击事件->为了让对话框出现
    addCateShowDialogBtnFn() {
      this.dialogVisible = true; // 让对话框出现
      this.editId = ""; // 编辑的文章分类id设置无
      this.isEdit = false; // 编辑的状态关闭
      //提前清空对话框数据
    },
    //对话框确认按钮---确认添加分类/还是编辑
    confirmFn() {
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          //需要判断是新增还是编辑--根据isEdit
          if (this.isEdit) {
            //编辑状态
            const { data: res } = await this.$API.updateCateAPI(
              this.addForm.cate_name,
              this.addForm.cate_alias,
              this.eidtId
            );
            if (res.status !== 200) return this.$message.error(res.message);
            this.$message.success(res.message);
          } else {
            //新增，添加分类
            const { data: res } = await this.$API.addArtCateAPI(
              this.addForm.cate_name,
              this.addForm.cate_alias
            );
            if (res.status !== 200) return this.$message.error(res.message);
            this.$message.success(res.message);
          }

          this.getArtCateList();
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    //对话框取消按钮
    cancelFn() {
      this.dialogVisible = false;
    },
    //对话框-关闭时的回调---清空对话框的数据
    dialogCloseFn() {
      //置空表单
      this.$refs.addRef.resetFields();
    },
    //修改分类按钮-->先做数据回显
    updateCateFn(rowObj) {
      //rowObj 每一行具体数据-->即cateList数组对应其中一个值
      //对话框回显
      this.dialogVisible = true;
      this.isEdit = true;
      this.eidtId = rowObj.id;
      //数据回显
      this.$nextTick(() => {
        // 先让对话框出现, 它绑定空值的对象, 才能resetFields清空用初始空值
        this.addForm.cate_name = rowObj.name;
        this.addForm.cate_alias = rowObj.alias;
      });
    },
    //删除按钮->删除数据
    async removeFn(rowObj) {
     const {data:res}=await this.$API.deleteCateAPI(rowObj.id)
     if(res.status!==200) return this.$message.error(res.message)
     this.$message.success(res.message)
     //重新获取数据
     this.getArtCateList()
    },
  },
};
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>