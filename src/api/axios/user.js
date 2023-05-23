import request from '@/api'

const user={
    login: (params={})=>{  //登录
        return request.post('/user/login',null,{params})
    },
    logout:()=>{  //退出登录
        return request.post('/user/logout')
    },
    getLocalUser:()=>{  //获取当前用户信息
        return request.get('/user/getLocalUser')
    },
    getEmailCode:(params={})=>{  //获取验证码
        return request.get('/user/getEmailCode',{params})
    },
    register:(data={})=>{  //注册
        return request.post('/user/register',data)
    },
    getUserInfo:(params={})=>{  //查询个人用户信息
        return request.get('/user/getUserInfo',{params})
    },
    updateUserInfo:(data={})=>{  //修改个人资料
        return request.put('/user/update',data)
    },
    updatePwd:(params={})=>{  //修改密码
        return request.put('/user/updatePwd',null,{params})
    },
    delUser:(params={})=>{   //删除某个用户
        return request.delete('/user/delUser',{params})
    },
    getTeacher:()=>{   //获取授课教师列表
        return request.get('/course/teacher')
    },
    frozenUser:(params={})=>{  //冻结用户
        return request.put('/user/frozenUser',null,{params})
    },
    queryUsers:(data={})=>{   //获取用户列表
        return request.post('/user/queryAll',data)
    }
}

export default {
    ...user
}