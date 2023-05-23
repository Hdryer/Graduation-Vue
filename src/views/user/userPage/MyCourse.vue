<template>
    <div class="main">
        <el-row class="class-list">
            <el-col :xs="24" :sm="12" :md="6" class="class-item" v-for="item in classList" :key="item.id">
                <el-card shadow="hover" class="class-card">
                    <img :src= "require('../../../assets/'+item.img)" alt="课程封面" />
                    <h4>{{ item.title }}</h4>
                    <div class="class-info">
                        <span style="margin-right:50px">{{ item.teacher }}</span>
                        <el-link type="primary">编辑</el-link> |
                        <el-link type="danger">删除</el-link>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'myClass',
        data() {
            return {
                classList: [
                    {
                        id: 1,
                        img: 'logo.png',
                        title: '阅读是一种态度',
                        teacher: '张老师',
                        price: '￥148.00'
                    },
                    {
                        id: 2,
                        img: 'logo.png',
                        title: '打好基础，才能出奇迹',
                        teacher: '王老师',
                        price: '￥198.00'
                    },
                    {
                        id: 3,
                        img: 'logo.png',
                        title: '数学除了公式还有思维',
                        teacher: '李老师',
                        price: '￥178.00'
                    }
                ]
            }
        },
    }
</script>

<style>

</style>