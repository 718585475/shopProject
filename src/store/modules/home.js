import mockRequest from "@/utils/mockRequest"

const state={

    list:{}

}
const mutations={

    GETDATA(state,result){

        state.list = result

    }


}
const getters={}
const actions={

    async getData({commit}){
        let result =  await mockRequest.get('./home/list')
        if(result.code == 20000){

            commit('GETDATA',result.data)
        }
    }


}

export default{
    state,
    mutations,
    getters,
    actions


}