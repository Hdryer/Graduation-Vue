import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/user/user/Login.vue'
import user from "@/api/axios/user"
import store from '@/store/index'

//路由规则
const routes = [
    /*登录注册*/
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: () =>import('../views/user/user/Register')
    },
    {
        path: '/test',
        name: 'test',
        component: () =>
            import ('../views/Test.vue')
    },
    {
        path: '/videoPlayPage',
        name: 'videoPlayPage',
        component: () =>import('../views/user/course/Video')
    },

    /*主页面路由*/
    {
        path: '/main',
        name: 'main',
        redirect: "/main/main",
        component: ()=> import('../components/Header'),
        children: [
            {
                path: 'main',
                component: () => import ('../views/user/course/Main.vue')
            },
            {
                path: 'course',
                component: ()=>import('../views/user/course/Course')
            },
            {
                path: 'onlineClass',
                component: () => import('../views/user/onlineClass/OnlineClass')
            },
            {
                path: 'paperCenter',
                component: () => import('../views/user/exam/Paper')
            },
            {
                path: 'test',
                component: () =>
                    import ('../views/Test.vue')
            },
            {   //用户中心
                path: 'userPage',
                redirect: "/main/userPage/userInfo",
                component: () => import('../views/user/userPage/UserPage'),
                children: [
                    {
                    path: 'userInfo',
                    component: () => import('../views/user/userPage/UserInfo')
                    },
                    {
                        path: 'test',
                        component: () =>
                            import ('../views/Test.vue')
                    },
                    {
                        path: 'accountInfo',
                        component: () =>import('../views/user/userPage/AccountInfo')
                    },
                    {
                        path: 'myCourse',
                        component: () => import('../views/user/userPage/MyCourse')
                    }
                    ]
            }
            ]
    },

    /*管理端路由*/
    {
        path: '/admin_main',
        name: 'admin_main',
        redirect: '/admin_main/userManage',
        component: () =>import('../views/admin/Main'),
        children: [
            {
                path: 'test',
                component: () =>
                    import ('../views/Test.vue')
            },
            {
                path: 'userManage',
                component: () => import('../views/admin/UserManage')
            },
            {
                path: 'sources',
                component: ()=> import('../views/admin/Sources')
            },
            {
                path: 'checkSources',
                component: ()=>import('../views/admin/CheckSources')
            },
            {
                path: 'courseManage',
                component:()=>import('../views/admin/CourseManage')
            },
            {
                path: 'courseTeacher',
                component:()=>import('../views/admin/CourseTeacher')
            },
            {
                path: 'questionManage',
                name:'questionManage',
                component:()=>import('../views/admin/QuestionManage')
            },
            {   path: 'oneChoiceQuestion',
                name:'SingleChoice',
                component:()=>import('../views/admin/OneChoiceQuestion')
            },
            {
                path: 'checkQuestion',
                name: 'checkQuestion',
                component:()=>import('../views/admin/CheckQuestion')
            },
            {
                path: 'paperManage',
                name: 'paperManage',
                component:()=>import('../views/admin/PaperManage')
            },
            {
                path: 'paper',
                name: 'paper',
                component:()=>import('../views/admin/Paper')
            }
        ]
    },
    {
        path: '/editOutline',
        name: 'editOutline',
        component: ()=>import('../views/admin/EditOutline')
    },
    {
        path: '/onlineExam',
        name: 'onlineExam',
        component: ()=>import('../views/user/exam/OnlineExam')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//全局守卫：登录拦截,本地没有存token，请重新登录
router.beforeEach((to, from, next) => {
    // 判断有没有登录
    if (!localStorage.getItem('token')) {
        if (to.name == "login" || to.name=="register") {
            next();
        } else {
            ElMessage.error('请先登录再操作');
            router.push({name:"login"});
        }
    } else {
        user.getLocalUser().then(res=>{
            console.log(res.data)
            store.commit('setUserDTO',res.data.data)
        }).catch(error =>{
            console.log(error.data)
        })
        next();
    }
});

export default router