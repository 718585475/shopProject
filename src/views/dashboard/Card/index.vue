<template>
  <div>

    

    <el-row :gutter="5">
      <el-col :span="6"><el-card><Detail count="￥ 423423" title="销售额" >
            <template slot="charts">
                <span>周同比 &nbsp;&nbsp; 68.8% ↑</span>&nbsp;&nbsp;
                <span>日同比 &nbsp;&nbsp; 12.6% ↑</span>
            </template>

            <template slot="footer">
                <span>日销售额:￥2312</span>

            </template>


      </Detail></el-card></el-col>
      <el-col :span="6"><el-card><Detail count="88453" title="访问量" >
            
            <template slot="charts">
                <LineChart></LineChart>

            </template>


            <template slot="footer">
                <span>日访问量:222312</span>
                
            </template>

            


      </Detail></el-card></el-col>

      <el-col :span="6"><el-card><Detail count="3123123" title="支付笔数">

            <template slot="footer">
                <span>转化率:64%</span>
                
            </template>

      </Detail></el-card></el-col>

      <el-col :span="6"><el-card><Detail count="78%" title="运营活动效果">

            <template slot="footer">
                <span>周同比 &nbsp;&nbsp; 34.8% ↑</span>&nbsp;&nbsp;
                <span>日同比 &nbsp;&nbsp; 54.6% ↑</span>
            </template>

      </Detail></el-card></el-col>

    </el-row>
    
  </div>
</template>

<script>
import Detail from "./Detail";
import LineChart from './LineChart'


export default {
  data() {
    return {};
  },
  methods: {},
  //生命周期 - 创建完成
  created() {},

  //DOM挂载完毕
  mounted() {},
  components: {
    Detail,
    LineChart
  },
};
</script>
<style lang="" scoped></style>
