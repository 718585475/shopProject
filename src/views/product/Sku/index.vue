<template>
  <div>
    <el-table :data="records" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>

      <el-table-column prop="name" label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>

      <el-table-column prop="price" label="价格" width="80"> </el-table-column>

      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-top"
            v-if="row.isSale == 1"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-bottom"
            v-else
            @click="sale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--       @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      @current-change="getSkuList"
      @size-change="handleSizeChange"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
    >
    </el-pagination>
    <!-- 侧边栏 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              style="margin-right: 5px"
              type="success"
              v-for="(attr, index) in skuInfo.skuAttrValueList"
              :key="attr.id"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">

          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="width:452px; height:300px;">
            </el-carousel-item>
          </el-carousel>


        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import { isIfStatement } from "@babel/types";

export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,

      //存储sku列表数据
      records: [],
      total: 0,

      //侧边栏数据
      skuInfo: {},

      show: false,
    };
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;

      let result = await this.$API.sku.reqSkuList(page, limit);

      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },

    handleSizeChange(limit2) {
      this.limit = limit2;
      this.getSkuList();
    },

    async cancelSale(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "下架成功" });
        row.isSale = 0;
      }
    },

    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);

      if (result.code == 200) {
        this.$message({ type: "success", message: "上架成功" });
        row.isSale = 1;
      }
    },

    edit() {
      this.$message("正在开发中");
    },

    async getSkuInfo(row) {
      this.show = true;

      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
  //生命周期 - 创建完成
  created() {},

  //DOM挂载完毕
  mounted() {
    this.getSkuList();
  },
};
</script>
<style scoped>
.el-row .el-col-5 {
  font-size: 20px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

 .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

</style>
