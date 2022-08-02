<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          placeholder="规格描述"
          type="textarea"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select
              placeholder="请选择活动区域"
              v-model="attr.attrIdAndValueId"
            >
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择销售属性"
              v-model="saleAttr.attrIdAndValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column prop="name" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="name" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-tag type="success" v-else>默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spuImageList: [],

      spuSaleAttrList: [],

      attrInfoList: [],

      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        weight: "",
        price: 0,
        skuName: "",
        skuDesc: "",
        skuDefaultImg: "",

        skuAttrValueList: [
          // {
          //虽然接口里写的有很多数据  但是只需要收集这两个即可
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],

        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],

        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],

        //临时存放选中图片数据字段
        imageList: [],
      },

      //收集父组件传来的数值row
      spu: {},
    };
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      this.spu = spu;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.tmId = spu.tmId;

      //初始化时获取图片信息
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code == 200) {
        let list = result.data;

        //返回的数据没有isDefault  先加上
        list.forEach((item) => {
          item.isDefault = 0;
        });

        this.spuImageList = list;
      }

      //初始化时获取销售属性数据

      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }

      ////初始化时获取商品基础属性

      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );

      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },

    //table表格复选框触发后的事件 返回参数为选中的整行的数据 仅缺少isDefault字段
    handleSelectionChange(params) {
      this.imageList = params;
    },

    //默认和设为默认的排他思想做法

    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });

      row.isDefault = 1;

      //收集默认图片地址

      this.skuInfo.skuDefaultImg = row.imgUrl;
    },

    cancel() {
      this.$emit("changeScene2", 0);
      //清除数据
      Object.assign(this._data, this.$options.data());
    },

    // async save() {
    //   const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;

    //   //整理销售属性
    //   //临时数组 整理好后赋值给skuinfo
    //   let arr = [];

    //   attrInfoList.forEach((item) => {
    //     if (item.attrIdAndValueId) {
    //       const [attrId, valueId] = item.attrIdAndValueId.split(":");
    //       let obj = {attrId,valueId};

    //       arr.push(obj);
    //     }
    //   });

    //   skuInfo.skuAttrValueList = arr;

    //   //整理平台属性

    //   let arr2 = [];

    //   spuSaleAttrList.forEach((item) => {
    //     if (item.attrIdAndValueId) {
    //       const [saleAttrId, saleAttValuerId] =
    //         item.attrIdAndValueId.split(":");
    //       let obj = { saleAttrId, saleAttValuerId };

    //       arr2.push(obj);
    //     }
    //   });

    //   skuInfo.skuSaleAttrValueList = arr2;

    //   //整理图片数据

    //   skuInfo.skuImageList = imageList.map((item) => {
    //     return {
    //       imgName: item.imgName,
    //       imgUrl: item.imgUrl,
    //       isDefault: item.isDefault,
    //       spuImgId: item.id,
    //     };
    //   });

    //   let result =  await this.$API.spu.reqAddSku(this.skuInfo)

    //   if(result.code == 200){

    //     this.$message({type:'success',message:'添加SKU成功'})
    //     this.$emit('changeScene2',0)

    //   }

    // },

    async save() {
      //整理参数
      //整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      //整理平台属的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScene2", 0);
      }
    },

  },
  //生命周期 - 创建完成
  created() {},

  //DOM挂载完毕
  mounted() {},
};
</script>
<style lang="" scoped></style>
