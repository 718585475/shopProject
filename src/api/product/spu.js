import request from '@/utils/request'


//获取spu列表 /admin/product/{page}/{limit} 三个参数page,limit,category3Id
export const reqSpuList =(page,limit,category3Id)=>{

    return request({

        url:`/admin/product/${page}/${limit}?category3Id=${category3Id}`,
        method:'get',
        


    })


}