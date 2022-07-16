<template>
    <div>
        <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>

        <template>
            <el-table border style="width: 100%" :data="list">
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>
                <el-table-column prop="tmName" label="品牌名称" width="width">
                </el-table-column>
                <el-table-column label="LOGO" width="width">

                    <template slot-scope="{row,$index}">
                        <img :src="row.logoUrl" alt="" style="width: 100px;height:100px"></img>
                    </template>


                </el-table-column>
                <el-table-column prop="address" label="操作">

                    <template slot-scope="{row,$index}">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateTradeMark(row)">
                            修改
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTradeMark(row)">删除
                        </el-button>
                    </template>

                </el-table-column>
            </el-table>
        </template>


        <!-- 分页器 -->

        <!--          
         -->
        <el-pagination style="margin-top:20px; textAlign:center" @current-change="getPageList"
            @size-change="handleSizeChange" :current-page="3" :page-sizes="[3, 5, 10]" :page-size="limit"
            layout="prev, pager, next, jumper,->,sizes,total" :total="total">
        </el-pagination>


        <!-- 遮罩对话框 -->

        <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>


                <!-- 上传图片 -->

                <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
import { async } from 'q'

export default {
    name: 'tradeMark',
    data() {
        return {
            page: 1,
            limit: 3,
            total: 0,
            list: [],

            // 对话框显示隐藏
            dialogFormVisible: false,



            //收集添加品牌信息
            tmForm: {
                tmName: '',
                logoUrl: ''

            },
            rules: {

                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                logoUrl: [
                    { required: true, message: '请选择活动区域' }
                ],


            }

        }
    },
    methods: {

        async getPageList(pager = 1) {

            this.page = pager
            const { page, limit } = this
            let result = await this.$API.trademark.reqTradeMarkList(page, limit)
            // console.log(result);
            if (result.code == 200) {
                this.total = result.data.total
                this.list = result.data.records
            }

        },

        handleSizeChange(limit2) {

            this.limit = limit2

            this.getPageList()

        },


        showDialog() {

            this.dialogFormVisible = true

            this.tmForm = { tmName: '', logoUrl: '' }

        },

        updateTradeMark(row) {

            this.dialogFormVisible = true
            this.tmForm = { ...row }

        },

        handleAvatarSuccess(res, file) {
            this.tmForm.logoUrl = res.data
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        addOrUpdateTrademark() {

            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    this.dialogFormVisible = false


                    let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)

                    console.log(result);

                    if (result.code === 200) {

                        if (this.tmForm.id) {
                            this.$message({ type: 'success', message: '修改品牌成功' })
                        } else {
                            this.$message({ type: 'success', message: '添加品牌成功' })
                        }

                        this.getPageList(this.tmForm.id ? this.page : 1)


                    }





                } else {
                    console.log('error submit!!');
                    return false;
                }
            });







        },




        //删除品牌
        deleteTradeMark(row) {



           
                this.$confirm(`确定是否删除${row.tmName}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {

                   let result =  await this.$API.trademark.reqDeleteTradeMark(row.id)
                    if(result.code ==200){
                        this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });

                    this.getPageList(this.list.length>1 ?this.page : this.page-1)

                    }




                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            


        }





    },
    //生命周期 - 创建完成
    created() {

    },

    //DOM挂载完毕
    mounted() {

        this.getPageList();

    }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
