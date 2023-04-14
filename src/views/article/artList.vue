<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_name"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="item in cateList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getByName"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetListFn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>
      <!-- 文章表格区域 -->
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{
              scope.row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
          <el-button type="danger" size="mini" @click="removeFn(scope.row.id)">删除</el-button>
          </template>
     
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="AllartList.length"
      >
      </el-pagination>
    </el-card>
    <!-- 添加文章对话框区域 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="onDialogClosedFn"
    >
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="文章标题" prop="title" placeholder="请输入标题">
          <el-input v-model="pubForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_name">
          <el-select
            v-model="pubForm.cate_name"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <!-- 循环渲染分类的可选项 -->
            <!-- 整个表单需要发给后台,需要看后台需要什么数据--给value值应该为分类的id -->
            <el-option
              :label="cate.name"
              :value="cate.name"
              v-for="cate in cateList"
              :key="cate.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor
            v-model="pubForm.content"
            @focus="contentChangeFn"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFileRef"
            @change="changeCoverFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="pubArticleFn('草稿')"
            >存为草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ artDetail.pub_date }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 文章的封面 -->
      <img  alt="" :src="baseUrl+artDetail.cover_img" />
      <!-- 文章的详情 -->
      <div class="detail-box" v-html="artDetail.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import defaultImg from "../../assets/images/cover.jpg";
export default {
  name: "ArtList",
  data() {
    return {
      baseUrl:'http://127.0.0.1:3007',
      //全部文章数据
      AllartList: [],
      //表格数据
      tableData: [],
      //查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_name: "",
        state: "",
      },
      //添加文章的表单数据对象
      pubForm: {
        title: "",
        cate_name: "",
        content: "",
        cover_img: null, // 用户选择的封面图片(保存的是一个文件)（null 表示没有选择任何封面）,
        state: "", //文章的发布状态，可选值有两个：0 草稿、1 已发布
      },
      //表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "文章标题的长度为1-30个字符",
            trigger: "blur",
          },
        ],
        cate_id: [
          { required: true, message: "请选择文章标题", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "change" },
        ],
      },
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      cateList: [], //文章分类
      //文章详情
      detailVisible: false, // 控制文章详情对话框的显示与隐藏
      artDetail: {}, // 文章的详情信息对象
    };
  },
  created() {
    this.initCateList();
    this.initgetArticleList();
  },
  methods: {
    //发布文章-对话框-关闭前的回调
    //注意: dialog自带的右上角的x,和按下esc,点击蒙层才会触发此回调
    handleClose(done) {
      //done的作用--调用才会关闭对话框
      console.log("1");
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //发表文章按钮--点击事件--对话框出现
    showPubDialogFn() {
      this.pubDialogVisible = true;
    },
    //初始化文章分类的列表数据
    async initCateList() {
      const { data: res } = await this.$API.getArtCateAPI();
      if (res.status === 200) {
        this.cateList = res.data;
      }
    },
    //触发选择文件按钮
    chooseImgFn() {
      this.$refs.iptFileRef.click();
    },
    //检测input按钮有没有选择文件--设置文件
    changeCoverFn(e) {
      // 获取用户选择的文件列表
      const files = e.target.files;
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null;
        this.$refs.imgRef.setAttribute("src", defaultImg);
      } else {
        // 用户选择了封面,把文件直接保存到表单对象属性
        this.pubForm.cover_img = files[0];
        //over_img属性的值是图片文件, 后续要传递给后台的,
        //而src路径只能设置临时地址/base64字符串---只是做一个单纯的预览效果
        const url = URL.createObjectURL(files[0]);
        this.$refs.imgRef.setAttribute("src", url);
      }
    },
    // 发布文章或草稿-按钮点击事件--设置状态
    pubArticleFn(state) {
      //1.设置发布状态
      this.pubForm.state = state;
      // 2. 表单预校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请完善文章信息！");
        // 3. 判断是否提供了文章封面
        if (!this.pubForm.cover_img)
          return this.$message.error("请选择文章封面！");
        // 4. TODO：发布文章

        //创建FormData对象
        const fd = new FormData();
        //向FormData对象加上需要提交的数据
        Object.keys(this.pubForm).forEach((key) => {
          fd.append(key, this.pubForm[key]);
        });

        //发起请求
        const { data: res } = await this.$API.uploadArticleAPI(fd);
        if (res.status !== 200) return this.$message.error(res.message);
        this.$message.success(res.message);
        //关闭对话框
        this.pubDialogVisible = false;
        //刷新文章列表数据
        this.initgetArticleList();
      });
    },
    //富文本编辑器内容change事件
    contentChangeFn() {
      //让el-mentui进行检测
      this.$refs.pubFormRef.validateField("content");
    },
    //对话框关闭回调----清空所有数据
    onDialogClosedFn() {
      //清空表单数据
      this.$refs.pubFormRef.resetFields();
      //图片数据没有清除---不属于表单绑定
      this.$refs.imgRef.setAttribute("src", defaultImg);
    },
    //获得所有文章数据
    async initgetArticleList() {
      let { data: res } = await this.$API.getAllArticleAPI();
      if (res.status !== 200) return this.$message.error(res.message);
      this.AllartList = res.data;
    },
    //分页->每页条数改变时触发
    handleSizeChangeFn(sizes) {
      //当前需要每页显示的条数

      //将页码变回1
      this.q.pagenum = 1;
      this.q.pagesize = sizes;
      this.getTableData();
    },
    //当前页码改变时触发
    handleCurrentChangeFn(nowPage) {
      //当前所在显示的页码
      this.q.pagenum = nowPage;
      this.getTableData();
    },
    //获取表格数据,自行分页
    getTableData() {
      //AllartList是全部数据
      this.tableData = this.AllartList.slice(
        (this.q.pagenum - 1) * this.q.pagesize,
        this.q.pagenum * this.q.pagesize
      );
    },
    //筛选按钮--按照文章类名
    async getByName() {
      //将页码变回1
      this.q.pagenum = 1;
      let { data: res } = await this.$API.getArticleByDetail(
        this.q.cate_name,
        this.q.state
      );
      if (res.status !== 200) return this.$message.error(res.message);
      this.AllartList = res.data;
    },
    //重置筛选选项
    resetListFn() {
      //重置查询参数对象
      this.q.cate_name = "";
      this.q.state = "";
      //重置页面为1
      this.q.pagenum = 1;
      //需要将数据重新按没有查询的时候返回
      this.initgetArticleList();
    },
    //获取文章详情
    async showDetailFn(id) {
      let { data: res } = await this.$API.getArticleInfo(id);
      if (res.status !== 200) return this.$message.error(res.message);
      this.artDetail = res.data;
      //展示详情对话框
      this.detailVisible = true;
    },
    //删除文件
    async removeFn(id){
        let {data:res}=await this.$API.deleteArticleInfo(id)
        if(res.status!==200) return this.$message.error(res.message)
        this.q.pagenum=1
        this.$message.success(res.message)
        this.initgetArticleList()
    }
  },
  watch: {
    AllartList() {
      // this.$nextTick(()=>{
      this.getTableData();
      // })
    },
  },
};
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度---因为富文本编辑器quilerEditor是一个子组件---需要进行穿透选择
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// // [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>