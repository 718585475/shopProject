import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes,resetRouter,anyRoutes,constantRoutes } from '@/router'
import { log } from 'console'
import router from '@/router'


const getDefaultState = () => {
  return {
    //获取token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
    routes:[],
    //角色信息
    roles:[],
    //按钮权限的信息
    buttons:[],
    //对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的理由】
    resultAsyncRoutes:[],
    //用户最终需要展示全部路由
    resultAllRputes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles


  },

  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    
     state.resultAsyncRoutes =asyncRoutes
     //合并用户可以展示的路由
     state.resultAllRputes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)

     //最后为注册路由router注入全部对应用户可显示的路由
     router.addRoutes(state.resultAllRputes)
  }


}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })

    let result = await login({ username:username.trim(), password:password })

    if(result.code == 20000){

      commit('SET_TOKEN',result.data.token);
      setToken(result.data.token);
      return 'ok'
    }else{

      return Promise.reject(new Error('faile'));
      

    }


  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
         
          commit('SET_USERINFO',data)
          commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}


//定义一个函数作为过滤对比出哪些用户能显示哪些页面
const computedAsyncRoutes = (asyncRoutes,routes)=>{

  return asyncRoutes.filter(item=>{

    if(routes.indexOf(item.name) != -1){

        if(item.children && item.children.length){
            item.children = computedAsyncRoutes(item.children,routes)
        }

        return true;
    }



  })


}



export default {
  namespaced: true,
  state,
  mutations,
  actions
}

