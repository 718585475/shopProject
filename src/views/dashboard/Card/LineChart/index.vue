<template>
    <div class="charts" ref="charts">
       
    </div>
</template>

<script>
    import * as echarts from 'echarts'

   export default {
      data() {
          return {

          }
      },
      methods: {


      },
      //生命周期 - 创建完成
     created(){ 
       
     },

     //DOM挂载完毕
     mounted() {
        
        let lineCharts =  echarts.init(this.$refs.charts)

        lineCharts.setOption({
            xAxis:{
                show:false,
                type:'category'

            },
            yAxis:{

                show:false
            },

            series:[
                {
                    type:'line',
                    data:[10,23,33,16,26],

                    itemStyle:{
                        opacity:0

                    }
                }



            ],

            grid:{

                left:0,
                top:0,
                bottom:0,
                right:0


            }



        })

     }
 }
</script>
<style  scoped>

.charts{
    width: 100%;
    height: 100%;

}

</style>
