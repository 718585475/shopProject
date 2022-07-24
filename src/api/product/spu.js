import request from '@/utils/request'


//获取spu列表 /admin/product/{page}/{limit} 三个参数page,limit,category3Id
export const reqSpuList =(page,limit,category3Id)=>{

    return request({

        url:`/admin/product/${page}/${limit}?category3Id=${category3Id}`,
        method:'get',
        


    })


}

//GET /admin/product/getSpuById/{spuId}  获取spu基本信息

export const reqSpu = (spuId)=>{

    return request({
        url:`/admin/product/getSpuById/${spuId}`,
        method:'get'
    
    
    
    })


}

//GET /admin/product/baseTrademark/getTrademarkList 获取下拉品牌的信息

export const reqTrademarkList =()=>{

    return request({

        url:'/admin/product/baseTrademark/getTrademarkList',
        method:'get'


    })

}


//GET /admin/product/spuImageList/{spuId}  获取spu图片的接口
export const reqSpuImageList = (spuId)=>{

    return request({

        url:`/admin/product/spuImageList/${spuId}`,
        method:'get'


    })


}

//GET /admin/product/baseSaleAttrList 获取平台全部销售属性  一共三个

export const reqBaseSaleAttrList = ()=>{

    return request({

        url:'/admin/product/baseSaleAttrList',
        method:'get'


    })

}

//一个接口同时实现修改和添加按钮 二者唯一区别是有没有携带id
//POST /admin/product/updateSpuInfo

// POST /admin/product/saveSpuInfo

export const reqAddOrUpdateSpu =(spuInfo)=>{

    if(spuInfo.id){

        return request({

            url:'/admin/product/updateSpuInfo',
            method:'post',
            data:spuInfo

        })


    }else{

        return request({

            url:'/admin/product/saveSpuInfo',
            method:'post',
            data:spuInfo

        })


    }

}