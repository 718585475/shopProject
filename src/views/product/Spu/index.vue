<template>
  <div>
    <!-- //三级联动 -->
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0">
      </CategorySelect>
    </el-card>

    <!-- //底部显示栏 -->
    <el-card>
      <!-- 第一种形态：展示数据表格 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >

        <el-table :data="records" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                style="margin-right: 10px"
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="新增SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                style="margin-right: 10px"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                style="margin-right: 10px"
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前SPU全部的SKU列表"
                @click="handler(row)"
              ></el-button>

              <el-popconfirm
                style="margin-right: 10px"
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!--         @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 第二种形态：点击添加spu按钮和修改按钮后的形态 -->
      <div v-show="scene == 1">
        <spuForm @changeScene="changeScene" ref="spu"></spuForm>
      </div>
      <!-- 第三种形态：添加sku -->
      <div v-show="scene == 2">
        <skuForm ref="sku" @changeScene2="changeScene2"></skuForm>
      </div>
    </el-card>

    <!-- 查看spu的sku列表按钮 -->
    <el-dialog
      :before-close="close"
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
    >
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column property="price" label="价格" width="100">

        </el-table-column>
        <el-table-column property="weight" label="重量" width="100">
           </el-table-column>

        <el-table-column label="默认图片" width="width">
        
          <template slot-scope="{row,$index}">

              <img :src="row.skuDefaultImg" style="witdh:100px;height:100px">


          </template>
        
        </el-table-column>



      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuForm from "./spuForm";
import skuForm from "./skuForm";

export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",

      page: 1,
      limit: 3,

      show: true,

      total: 0,
      records: [],

      //0,1,2表示显示三种形态哪一种
      scene: 0,

      //查看当前SPU全部的SKU列表按钮控制显示隐藏
      dialogTableVisible: false,

      spu: {},

      skuList: [],

      //加载效果
      loading: true

    };
  },

  components: {
    spuForm,
    skuForm,
  },

  methods: {
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;

      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);

      if (result.code == 200) {
        (this.total = result.data.total), (this.records = result.data.records);
      }
    },

    handleSizeChange(limit2) {
      this.limit = limit2;
      this.getSpuList();
    },

    handleCurrentChange(pages) {
      this.page = pages;
      this.getSpuList();
    },

    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;

        //获取spu列表数据
        this.getSpuList();
      }
    },

    //添加spu大按钮
    addSpu() {
      this.scene = 1;

      this.$refs.spu.addSpuData(this.category3Id);
    },

    //修改spu小按钮
    updateSpu(row) {
      this.scene = 1;

      this.$refs.spu.initSpuData(row);
    },

    //spuForm取消按钮
    changeScene({ scene, flag }) {
      this.scene = scene;

      if (flag == "修改") {
        //如果为修改 停在当前页
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },

    //skuForm取消按钮
    changeScene2(scene) {
      this.scene = scene;
    },

    //删除按钮
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);

      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });

        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },

    addSku(row) {
      this.scene = 2;
      //将子组件需要的三个id和row用父组件带给子组件
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },

    //查看当前SPU全部的SKU列表按钮
    async handler(row) {
      this.dialogTableVisible = true;
      this.spu = row;

      let result = await this.$API.spu.repSkuList(row.id);

      if (result.code == 200) {
        this.skuList = result.data;

        this.loading = false
      }
    },

    
    //关闭对话框
    close(done){
      this.loading = true

      this.skuList = []

      done()
    }




  },
  //生命周期 - 创建完成
  created() {},

  //DOM挂载完毕
  mounted() {},
};
</script>
<style lang="" scoped></style>
