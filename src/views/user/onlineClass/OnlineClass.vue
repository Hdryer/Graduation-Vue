<template>
    <div class="wrapper">
        <!-- 二级菜单 -->
        <el-menu mode="horizontal" class="menu">
            <el-sub-menu index="course" popper-class="submenu-popper">
                <template #title>课程</template>
                <el-menu-item index="math">数学课</el-menu-item>
                <el-menu-item index="english">英语课</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="teacher" popper-class="submenu-popper">
                <template #title>教师</template>
                <el-menu-item index="tom">Tom</el-menu-item>
                <el-menu-item index="lucy">Lucy</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-menu-item index="lucy"></el-menu-item>
            <el-input  placeholder="搜索" size = "small" style="width: 400px;" ></el-input>
            <el-button type="primary" >搜索</el-button>
        </el-menu>


        <!-- 在线课堂列表 -->
        <ul class="classroom-list">
            <li class="classroom-item" v-for="(item, index) in classroomList" :key="index">
                <div class="avatar-wrapper">
                    <img :src="item.avatar" alt="avatar" class="avatar">
                    <p class="teacher-name">{{ item.teacher }}</p>
                </div>
                <div class="class-title">{{ item.title }}</div>
                <div class="enter-btn-wrapper">
                    <el-button type="primary" size="small">进入课堂</el-button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import { ElMenu, ElSubMenu, ElMenuItem, ElInput, ElButton } from 'element-plus';
    import Header from "@/components/Header";

    export default defineComponent({
        name: 'onlineClass',
        data() {
            return {
                classroomList: [
                    {
                        avatar: 'https://picsum.photos/12',
                        teacher: '李老师',
                        title: '计算机网络'
                    },
                    {
                        avatar: 'https://picsum.photos/42',
                        teacher: '刘老师',
                        title: '操作系统'
                    },
                    {
                        avatar: 'https://picsum.photos/52',
                        teacher: '高老师',
                        title: '高等数学'
                    },
                    {
                        avatar: 'https://picsum.photos/58',
                        teacher: 'bindada',
                        title: '线性代数'
                    }
                ]
            };
        },
        components: {
            ElMenu,
            ElSubMenu,
            ElMenuItem,
            ElInput,
            ElButton,
            Header
        }
    });
</script>

<style scoped>
    .wrapper {
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 20px;
    }
    .el-input el-input--small{
        height: 30px;
        border-radius: 5px;
    }
    .menu {
        margin-bottom: 20px;
    }
    .submenu-popper {
        z-index: 999;
    }
    .search-box {
        width: 200px;
    }
    .classroom-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .classroom-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    .avatar-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
    }
    .avatar {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
    }
    .teacher-name {
        font-size: 12px;
        color: #666;
        margin-top: 5px;
    }
    .class-title {
        flex: 1;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-left: 20px;
    }
    .enter-btn-wrapper {
        margin-left: 20px;
    }
</style>
