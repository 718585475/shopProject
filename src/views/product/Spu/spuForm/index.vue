<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="spu名称">
        <el-input placeholder="spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌" :model="spu.tmId">
        <el-select placeholder="请选择品牌" value="">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="spu描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="spu描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="spu图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectedSaleAttr.length}项未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectedSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>

        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>

        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="180" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>

              <!--                 @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
                <!--                 @click="showInput" -->
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index,1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      //存储spu信息属性 注意这里既要考虑添加属性按钮，又要考虑修改属性按钮 不能设为空对象{},要有新增要带参数的完整的值为空的结构
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        //收集品牌的id
        tmId: '',

        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],

        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },

      //存储品牌信息
      tradeMarkList: [],

      //存储spu图片
      spuImageList: [],

      //销售属性数据
      saleAttrList: [],

      //收集未选择销售属性的id
      attrIdAndAttrName:''

    };
  },
  methods: {
    //图片只有少了或多了才需要更改数据存储
    //删除图片后 图片数量变更了需要改收集图片的数组spuImageList  需要注意的是目前先给spuImageList而不是直接给spu因为将来对接口发请求服务器是不需要url和name属性的 需要处理后再给spu
    handleRemove(file, fileList) {
      //file为删除的那一张图地址 fileList为剩余图片
      this.spuImageList = fileList
    },


    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //handlerSuccess表示上传成功的方法on-success是组件自带的  fileList是收集成功后所有图片的信息
    handlerSuccess(response, file, fileList){
      this.spuImageList = fileList


    },


    //初始化spu的数据
    async initSpuData(row) {
      // console.log('初始化spu');

      // 获取spu基本信息
      let spuResult = await this.$API.spu.reqSpu(row.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }

      //获取下拉品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTrademarkList();

      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      //获取spu图片

      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id);

      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;

        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });

        this.spuImageList = listArr;
      }

      //获取平台全部销售属性  一共三个
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();

      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //添加spu按钮的方法
    async addSpuData(category3Id){
      this.spu.category3Id = category3Id
        //获取下拉品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTrademarkList();

      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      //获取平台全部销售属性  一共三个
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();

      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }


      

    },


    addSaleAttr(){

      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(":")

      //先申请一个新变量 整理好后再赋给spu.spuSaleAttrList
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}

      this.spu.spuSaleAttrList.push(newSaleAttr)

      this.attrIdAndAttrName = ''


    },



    addSaleAttrValue(row){

      this.$set(row,'inputVisible',true)

      this.$set(row,'inputValue','')

    },


    handleInputConfirm(row){
      
      const {baseSaleAttrId,inputValue} = row

      if(inputValue.trim()==''){
        this.$message('属性值不能为空')
        return;
      }

      //属性值不能重复
      let result = row.spuSaleAttrValueList.every(item=>{

        return item.saleAttrValueName != inputValue


      })

      //如果重复为真  则不能执行下面的
      if(!result){
        return;
      }



      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}

      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false

    },


  //保存按钮
    async addOrUpdateSpu(){

      //照片目前还暂存在spuImageList里  按接口数据格式需要新增imageUrl和imageName属性后，赋值给spu后数据才完整

       this.spu.spuImageList  =this.spuImageList.map(item=>{
          return{

              imgName:item.name,
              imgUrl:(item.response&&item.response.data)||item.url

          }
      })

      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)

      if(result.code == 200){
        this.$message({type:'success',message:'保存成功'})

        //通知父组件切换场景
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})



      }

            //点击后要清除数据 防止回显
      Object.assign(this._data, this.$options.data()); 



    },


    cancel(){
      
      this.$emit('changeScene', {scene:0,flag:''})

        //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());

    }


  },

  computed: {
    unSelectedSaleAttr() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });

      return result;
    },
  },

  //生命周期 - 创建完成
  created() {},

  //DOM挂载完毕
  mounted() {},
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
