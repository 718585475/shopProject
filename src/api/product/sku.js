import request from '@/utils/request'

// GET /admin/product/list/{page}/{limit}  获取sku列表

export const reqSkuList =(page,limit)=>{
    return request({

        url:`/admin/product/list/${page}/${limit}`,
        method:'get'


    })



}


//GET /admin/product/cancelSale/{skuId}  下架商品
export const reqCancel = (skuId)=>{

    return request({

        url:`/admin/product/cancelSale/${skuId}`,
        method:'get'


    })


}

//GET /admin/product/onSale/{skuId}  上架
export const reqSale = (skuId)=>{

    return request({

        url:`/admin/product/onSale/${skuId}`,
        method:'get'


    })


}


//GET /admin/product/getSkuById/{skuId} 获取侧边栏sku详情
export const reqSkuById =(skuId)=>{

    return request({

        url:`/admin/product/getSkuById/${skuId}`,
        method:'get'



    })

}












