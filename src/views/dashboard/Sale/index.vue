<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0">
      <!-- 顶部内容 -->
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs class="left" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>

        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>

          <el-date-picker
           v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>

      <div class="content">
        <el-row>
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>

          <el-col :span="6">
            <div class="count">
                <h3>{{title}}排名</h3>

                <ul>
                    <li>
                        <span class="index">1</span>
                        <span>KFC</span>
                        <span class="value">234234</span>

                    </li>
                    <li>
                        <span class="index">2</span>
                        <span>KFC</span>
                        <span class="value">324</span>

                    </li>
                                        <li>
                        <span class="index">3</span>
                        <span>KFC</span>
                        <span class="value">23423</span>

                    </li>
                                        <li>
                        <span class="index">4</span>
                        <span>KFC</span>
                        <span class="value">23445</span>

                    </li>
                                        <li>
                        <span class="index">1</span>
                        <span>KFC</span>
                        <span class="value">5445</span>

                    </li>
                </ul>

            </div>
            </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from 'dayjs'

export default {
  data() {
    return {
      activeName: "sale",

      myCharts:null,

      date:[]

    };
  },
  methods: {

    setDay(){

        let day = dayjs().format('YYYY-MM-DD')
        this.date = [day,day]

    },


    setWeek(){
        let start = dayjs().day(1).format('YYYY-MM-DD')
        let end = dayjs().day(7).format('YYYY-MM-DD')
        this.date = [start,end]

    },

    setMonth(){
        let start = dayjs().startOf('month').format('YYYY-MM-DD')
        let end = dayjs().endOf('month').format('YYYY-MM-DD')
        this.date = [start,end]

    },

    setYear(){
        let start = dayjs().startOf('year').format('YYYY-MM-DD')
        let end = dayjs().endOf('year').format('YYYY-MM-DD')
        this.date = [start,end]
    }



  },
  //生命周期 - 创建完成
  created() {},

  computed:{

    title(){

        return this.activeName =='sale'?'销售额':'访问量'
    }


  },

    watch:{
        title(){

            this.myCharts.setOption({
                title:{
                    text:this.title
                }
            })


        }
    },


  //DOM挂载完毕
  mounted() {
     this.myCharts = echarts.init(this.$refs.charts);

    this.myCharts.setOption({
        title:{
            text:this.title+'趋势'
        },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["1", "2", "3", "4", "5", "6", "7","8","9","10","11","12"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220,324,34,545,78,65],
        },
      ],
    });
  },
};
</script>

<style>



.el-card__header {
  border-bottom: none;
}

.left {
  float: left;
}

.right {
  float: right;
}

.right > span {
  margin-right: 10px;
}

.count ul li .value{
float: right;


}

.charts {
  width: 100%;
  height: 300px;
}

.count ul{
    width: 100%;
    height: 300px;
    list-style: none;
    padding: 0;

}
.count ul li{

margin-top: 5px;
height: 10%;

}

.count ul li span{

    float: left;
    margin-right:20px;


}

.index{
float: left;
width: 20px;
height: 20px;
border-radius: 50%;
background-color: black;
color: white;
text-align: center;


}

.right span:hover{

    color: blue;

}


</style>
