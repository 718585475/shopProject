import request from '@/utils/request'

// /admin/product/baseTrademark/{page}/{limit}

export const reqTradeMarkList =(page,limit)=>{

    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'get'

    })


}

// 添加品牌 /admin/product/baseTrademark/save  post

// 修改品牌 /admin/product/baseTrademark/update  put

export const reqAddOrUpdateTradeMark =(tradeMark)=>{

    if(tradeMark.id){

        return request({
            url:'/admin/product/baseTrademark/update',
            method:'put',
            data:tradeMark

        })

    }else{

        return request({

            url:'/admin/product/baseTrademark/save',
            method:'post',
            data:tradeMark

        })

    }
     


}



// 删除品牌 /admin/product/baseTrademark/remove/{id}  delete
export const  reqDeleteTradeMark = (id)=>{

    return request({

        url:`/admin/product/baseTrademark/remove/${id}`,
        method:'delete'


    })


}

