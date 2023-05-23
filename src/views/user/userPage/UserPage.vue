<template>
    <el-container class="personal-center">
        <!-- 左侧菜单栏 -->
        <el-aside width="20%">
            <div class="user-info">
                <el-avatar shape="circle" :size="100" :src="avatar"></el-avatar>
                <p class="name">{{ username }}</p>
            </div>
            <el-divider />
            <el-menu :default-active="activeIndex" class="menu" active-text-color="#409EFF"  @select="handleSelect">
                <el-menu-item index="profile"><router-link style="text-decoration: none; color: #333333;font-size: medium"  to="/main/userPage/userInfo">个人资料</router-link></el-menu-item>
                <el-menu-item index="myCourse"><router-link style="text-decoration: none; color: #333333;font-size: medium" to="/main/userPage/myCourse">我的资源</router-link></el-menu-item>
                <el-menu-item index="learningCourse"><router-link style="text-decoration: none; color: #333333 ;font-size: medium " to="/main/userPage/myCourse">在学课程</router-link></el-menu-item>
                <el-menu-item index="account"><router-link style="text-decoration: none; color: #333333;font-size: medium" to="/main/userPage/accountInfo">账户设置</router-link></el-menu-item>
            </el-menu>
            <el-divider direction="vertical" />
        </el-aside>
        <!-- 右侧内容区域 -->
        <el-container>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import { ElAvatar, ElAside, ElContainer, ElMain, ElMenu, ElMenuItem } from 'element-plus'
    import Header from "@/components/Header";

    export default{
        name: 'userPage',
        components: { ElAvatar, ElAside, ElContainer, ElMain, ElMenu, ElMenuItem,Header },

        data() {
            return {
                activeIndex:"",
                avatar: 'https://picsum.photos/id/239/200/200',
                username: '张三',
            }
        },
        methods:{
            handleSelect(index) {
                this.activeIndex = index
                // TODO: 处理菜单点击事件
            },
        },

        mounted() {
          this.username=this.$store.state.userInfoDTO.userName
        }
    }
</script>

<style scoped>
    .el-menu-item{
        width: 100%;
    }
    .el-menu-item a{
        margin-left: 85px;
        text-align: center;
    }
</style>
