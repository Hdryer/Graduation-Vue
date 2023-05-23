import axios from "axios"
import querystring from "querystring"
import store from '@/store'


const service = axios.create({
    //网络请求的公共配置
    baseURL:'/api',
    timeout: 5000,

 /*   headers:{
        "Content-Type": "charset=UTF-8"
    }*/
})

// 拦截器
// 发送数据之前
service.interceptors.request.use(
    config => {
    /*    if (config.method === "post") {
            config.data =
                querystring.stringify(config.data)
        }*/
        // 每次发送请求之前都检测vuex是否存有token，放在请求头里面发送给服务器
        config.headers['token'] = store.getters.getToken;
        return config;
    },
    error =>{
        console.log(error)
        return  Promise.reject(error)
    }
)

// 获取数据之前
service.interceptors.response.use(
    response =>{
        console.log("获取数据前...")
        const res = response.data;
        if (Array.isArray(res))
            return Promise.resolve(response);
        else if (res.code===200){
            return Promise.resolve(response);
        }else  if (res.code === 403 || res.code === 404 ){
            store.commit("delToken");
            this.$message.error('登录信息已失效，请重新登录');
            this.$router.push({name:"login"});
        }else {
            ElMessage({
                message: res.message || '请求错误',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(new Error(res.message || '请求错误'))
        }
    },
    error =>{
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })

        return Promise.reject(error)
    }
)
export default service;