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
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>

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
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="新增SKU"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前SPU全部的SKU"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
              ></el-button>
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
        <skuForm></skuForm>

      </div>
    </el-card>
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
    };
  },

  components: {
    spuForm,
    skuForm,
  },

  methods: {
    async getSpuList(pages =1) {
      this.page = pages
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
    addSpu(){

        this.scene = 1


        this.$refs.spu.addSpuData(this.category3Id)

    },

    //修改spu小按钮
    updateSpu(row){
        this.scene = 1

        this.$refs.spu.initSpuData(row)
        


    },


    //spuForm取消按钮
    changeScene({scene,flag}){
      this.scene = scene

      if(flag=="修改"){
        //如果为修改 停在当前页
        this.getSpuList(this.page)

      }else{
        

        this.getSpuList()
      }


    }


  },
  //生命周期 - 创建完成
  created() {},

  //DOM挂载完毕
  mounted() {},
};
</script>
<style lang="" scoped></style>
