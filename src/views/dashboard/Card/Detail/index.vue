<template>
    <div>
       <div class="card-header">
        <span>{{title}}</span>
       </div>
       <div class="card-content">{{count}}</div>

       <div class="card-echarts">
            <slot name="charts">

            </slot>
       </div>

       <div class="card-footer">
            <slot name="footer">

            </slot>

       </div>
    </div>
</template>

<script>
import Sidebar from '@/layout/components/Sidebar/index.vue'
   export default {
    data() {
        return {};
    },

    props:[
        'title',
        'count'
    ],

    methods: {},
    //生命周期 - 创建完成
    created() {
    },
    //DOM挂载完毕
    mounted() {
    },
    components: { Sidebar }
}
</script>
<style  scoped>
.card-header{

display: flex;
justify-content: space-between;
color: gray;

}

.card-content{

    padding: 10px 0;
    font-size: 30px;


}

.card-echarts{
    height: 40px;
    font-size: 14px;

}

.card-footer{
    font-size: 14px;
    border-top: 1px solid gray;
    padding-top: 10px;


}


</style>
