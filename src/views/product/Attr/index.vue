<template>
    <div>
        <el-card>

            <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>

        </el-card>

        <el-card>
            <div v-show="isShowTable">

                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
                </el-button>


                <el-table height="250" border style="width: 100%" :data="attrList">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150">
                    </el-table-column>
                    <el-table-column prop="address" label="属性值列表" width="width">

                        <template slot-scope="{row,$index}">
                            <el-tag style="margin:0px 5px" type="success"
                                v-for="{ valueName, index } in row.attrValueList" :key="index">{{ valueName }}</el-tag>
                        </template>


                    </el-table-column>
                    <el-table-column prop="address" label="操作" width="150">

                        <template slot-scope="{row,$index}">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>

                        </template>

                    </el-table-column>
                </el-table>


            </div>


            <div v-show="!isShowTable">

                <el-form :inline="true" class="demo-form-inline" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input  placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>




                </el-form>

                <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
                <el-button @click="isShowTable = true">取消</el-button>


                <el-table  style="border;width: 100%;margin:20px 0px" :data="attrInfo.attrValueList">
                    <el-table-column type="index" label="序号" align='center' width="80">
                    </el-table-column>
                    <el-table-column prop="name" label="属性值名称" width="width">
                        <template slot-scope="{row,$index}">
                            <el-input :ref="$index" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" v-model="row.valueName" placeholder="请输入内容" size="mini"></el-input>
                            <span v-else @click="toEidt(row,$index)" style="display:block ;">{{row.valueName}}</span>
                        </template>

                    </el-table-column>
                    <el-table-column prop="address" label="操作" width="200">
                        <template slot-scope="{row,$index}">

                        <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteAttrValue($index)">
                            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" ></el-button>
                        </el-popconfirm>
                        
                        </template>
                    </el-table-column>
                </el-table>

                <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
                <el-button @click="isShowTable = true">取消</el-button>







            </div>


        </el-card>



    </div>
</template>

<script>

import cloneDeep from 'lodash/cloneDeep'


import CategorySelect from '@/components/CategorySelect/index.vue'
import { assertLiteral } from '@babel/types';
export default {
    name: "Attr",
    data() {
        return {

            category1Id: '',
            category2Id: '',
            category3Id: '',

            //平台属性数组
            attrList: [],


            isShowTable: true,

            //收集新增或修改的属性
            attrInfo: {
                attrName: '',
                attrValueList: [
  
                ],
                categoryId:0, //三级分类id
                categoryLevel:3, //三级分类id等级3

                

            }



        };
    },
    methods: {

        getCategoryId({ categoryId, level }) {

            if (level == 1) {

                this.category1Id = categoryId

                this.category2Id = ''
                this.category3Id = ''

            } else if (level == 2) {

                this.category2Id = categoryId
                this.category3Id = ''



            } else {

                this.category3Id = categoryId


                this.getAttrList()

            }

        },



        async getAttrList() {

            const { category1Id, category2Id, category3Id } = this

            let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)

            if (result.code == 200) {
                this.attrList = result.data
            }

        },


        //添加属性值按钮
        addAttrValue(){

            this.attrInfo.attrValueList.push({

                attrId:this.attrInfo.id,
                valueName:'',
                flag:true

            })

            this.$nextTick(()=>{

                this.$refs[this.attrInfo.attrValueList.length-1].focus()


            })




        },

    //避免点击添加属性页面切换后数据回显  ***同时收集三级分类的id
        addAttr(){

            this.attrInfo= {
                attrName: '',
                attrValueList: [
  
                ],
                categoryId:this.category3Id, //三级分类id
                categoryLevel:3 //三级分类id等级3

            }
            this.isShowTable = false



        },

        //修改按钮
        updateAttr(row){
            this.isShowTable = false
            this.attrInfo = cloneDeep(row)

            this.attrInfo.attrValueList.forEach(item=>{

                this.$set(item,'flag',false)

            })



        },

        //失去焦点的事件
        toLook(row){
           
            if(row.valueName.trim() == ''){
                this.$message('请输入正常内容')
                return;

            }

            let isreapt = this.attrInfo.attrValueList.some(item=>{

                if(row !== item){
                    return row.valueName == item.valueName
                }


            })

            if (isreapt) {
                this.$message('有重复数值')
                return;
            }

            row.flag=false
        },


        //点击span
        toEidt(row,index){

            

            row.flag=true
            this.$nextTick(()=>{

                this.$refs[index].focus()


            })



        },

        deleteAttrValue(index){

             this.attrInfo.attrValueList.splice(index,1)   


        },


        //保存按钮 保存前需要过滤掉值为空的值和删除falg属性
        async addOrUpdateAttr(){

            this.isShowTable = true

             this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{

                if(item.valueName != ''){
                    delete item.flag
                    return true
                }

            })


            

            try {
                
                 await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
                this.$message({type:'success',messsage:'保存成功'})
                this.getAttrList()

            } catch (error) {
                this.$message('保存失败')
            }




        }



    },
    //生命周期 - 创建完成
    created() {
    },
    //DOM挂载完毕
    mounted() {
    },
    components: { CategorySelect }
}
</script>
<style lang='' scoped>


</style>
