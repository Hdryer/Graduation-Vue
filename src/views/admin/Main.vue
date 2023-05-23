<template>
    <div class="wrapper">
        <!-- 左侧菜单栏 -->
        <el-menu :default-active="activeIndex" class="menu" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
            <el-sub-menu index="1" v-if="isShow">
                <template #title>
                    <i class="el-icon-user"></i><span>用户管理</span>
                </template>
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/userManage">用户列表</router-link></el-menu-item>
<!--                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/test">教师列表</router-link></el-menu-item>-->
            </el-sub-menu>
            <el-sub-menu index="2">
                <template #title>
                    <i class="el-icon-notebook-2"></i>
                    <span>课程管理</span>
                </template>
                <el-menu-item v-if="isShow" index=""><router-link  style="text-decoration: none;color: whitesmoke;"  to="/admin_main/courseManage">课程列表</router-link></el-menu-item>
                <el-menu-item v-if="!isShow" index=""><router-link  style="text-decoration: none;color: whitesmoke;"  to="/admin_main/courseTeacher">我的课程</router-link></el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3" v-if="isShow">
                <template #title>
                    <i class="el-icon-s-custom"></i>
                    <span>资源管理</span>
                </template>
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/sources">资源列表</router-link></el-menu-item>
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/checkSources">资源审批</router-link></el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="5">
                <template #title>
                    <i class="el-icon-document"></i>
                    <span>考核管理</span>
                </template>
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/paperManage">试卷列表</router-link></el-menu-item>
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/paper">试卷创编</router-link></el-menu-item>
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/questionManage">题目列表</router-link></el-menu-item>
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/oneChoiceQuestion">单选题创编</router-link></el-menu-item>
<!--                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/questionManage">多选题创编</router-link></el-menu-item>-->
                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/checkQuestion">判断题创编</router-link></el-menu-item>
<!--                <el-menu-item index=""><router-link style="text-decoration: none;color: whitesmoke;"  to="/admin_main/questionManage">简答题创编</router-link></el-menu-item>-->
            </el-sub-menu>
        </el-menu>
        <!-- 右侧内容区域 -->
        <div class="content">
            <el-page-header :icon="null">
                <template #extra>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                          欢迎您,{{this.$store.state.userInfoDTO.userName}}老师
                          <el-icon class="el-icon--right" style="cursor: pointer; color: var(--el-color-primary); display: flex; align-items: center;">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="toUser">切换至用户端</el-dropdown-item>
                                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-page-header>
            <hr>
           <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {user} from "@/api/axios";

    export default {
        data() {
            return {
                isShow:false,
                activeIndex: '',
                activeMenu: '',
                sortBy: '',
                search: '',
                userName: 'admin',
                tableData: [], // 表格数据
            };
        },
        mounted() {
            // 初始化选中的菜单
            const path = this.$route.path;
            this.activeIndex = path;
            this.activeMenu = this.getMenuTitle(path);
            // 获取表格数据
            this.getTableData();

            if(this.$store.state.userInfoDTO.type==3){
                this.isShow = true
            }
        },
        methods: {
            getMenuTitle(path) {
                switch (path) {
                    case '/student/list':
                    case '/student/add':
                        return '学生管理';
                    case '/course/list':
                    case '/course/add':
                        return '课程管理';
                    case '/teacher/list':
                    case '/teacher/add':
                        return '教师管理';
                    case '/data/report':
                    case '/data/analysis':
                        return '数据管理';
                    case '/question/list':
                    case '/question/add':
                        return '题库管理';
                    default:
                        return '首页';
                }
            },

            toUser(){
              this.$router.push({name:"main"})
            },
            getTableData() {
                // 向后台请求表格数据，并更新tableData
            },
            calcTableHeight() {
                // 根据页面高度计算表格高度
                return document.documentElement.clientHeight - 250;
            },
            async logout(){
                try {
                    const response =await user.logout();
                    if (response.data.code===200){
                        this.$store.commit("delToken");
                        this.$store.commit("delUserDTO");
                        this.$router.push({name:"login"});
                        ElMessage({
                            message: '注销成功',
                            type: 'warning',
                        })
                    }
                }catch (error) {
                    console.log(error.data)
                    console.log(error.data.code)
                }
            },
        },
    };
</script>

<style scoped>

    .example-showcase .el-dropdown-link {

    }
    .wrapper {
        overflow-y: hidden;
        display: flex;
        height: 100vh;
    }

    .menu {
        width: 200px;
        flex-shrink: 0;
    }

    .content {
        flex-grow: 1;
        padding: 10px;
        box-sizing: border-box;
        overflow: auto;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .user-info {
        display: flex;
        align-items: center;
        color: #333;
    }
    .user-info span {
        margin-right: 5px;
    }
    .main {
        background-color: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        box-sizing: border-box;
    }
</style>

