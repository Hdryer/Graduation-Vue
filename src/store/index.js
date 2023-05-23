import { createStore } from 'vuex'
import storage from "@/utils/storageUtil";

export default createStore({
  state: {
    userInfoDTO:{}  //可选
  },
  getters: {
    getToken(state){
      return state.token || storage.get("token") || "";
    }
  },

  mutations: {
    //修改token，并将token重新存入localStorage
    setToken(state,token){
      state.token=token;
      storage.set('token', token);
      console.log('store和localstorage保存token成功！');
    },
    //修改token，并将token重新存入localStorage
    flushToken(state,token){
      state.token=token;
    },
    //删除token,将本地的vuex里置为空，并且也移除localStorage里的值
    delToken(state) {
      state.token = "";
      storage.remove("token");
    },
    setUserDTO(state, userInfoDTO) {
      state.userInfoDTO=userInfoDTO;
    },
    delUserDTO(state){
      state.userInfoDTO={}
    }
  },
  actions: {

  },
  modules: {

  }
})
