<template>
    <div class="container">
        <div class="menu">
            <el-menu mode="horizontal">
                <el-input v-model="searchForm.paperName" style="width:400px;margin-left: 500px" placeholder="输入试卷名称"/>
                <el-button type="primary" @click="queryPaper">搜索</el-button>
            </el-menu>
        </div>
        <div class="content">
            <el-row :gutter="24">
                <el-col :span="6" v-for="(card, index) in cards" :key="index">
                    <el-card shadow="hover">
                        <h3>{{card.paperName}}</h3>
                        <div>
                            <span>学科：{{ card.subject }}</span>
                            <br>
                            <span>题目数：{{ card.questions }}</span>
                        </div>
                        <div>
                            <span>总分：{{ card.totalScore }}</span>
                            <br>
                            <span>考试时间：{{ card.examTime }}分钟</span>
                        </div>
                        <div class="card-footer">
                            <el-button type="primary" size="small" @click="handleStart(card.id)">开始答题</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <el-pagination
                :page-count="searchForm.pages"
                :current-page="searchForm.currentPage"
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange" hide-on-single-page />
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import { ElMenu, ElSubMenu, ElMenuItem } from 'element-plus';
    import { ElRow, ElCol, ElCard, ElButton } from 'element-plus';
    import Header from "@/components/Header";
    import {course, exam} from '@/api/axios'

    export default defineComponent({
        name: 'PaperCenter',
        data() {
            return {
                searchForm:{
                    paperName:"",
                    pages:1,
                    currentPage:1,
                },
                cards: []
            };
        },
        methods: {
            handleCurrentChange(){

            },
            handleStart(id) {
                this.$router.push({
                    name:"onlineExam",
                    query:{
                        id:id
                    }
                })
            },
            getQueryDTO(){
                const queryDTO={
                    paperId:"",
                    courseName:"",
                    paperName:this.searchForm.paperName,
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    current:this.searchForm.currentPage,
                }
                return queryDTO
            },
        },
        mounted() {
            exam.queryAllPaper(this.getQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[]
                this.cards=[]
                for (var i = 0; i < arr.length; i++) {
                    this.cards.push({id:arr[i].id,paperName:arr[i].name,subject:arr[i].courseName,examTime:arr[i].time,totalScore:arr[i].score,questions:arr[i].num})
                }
                this.searchForm.pages=res.data.data.pages
                this.searchForm.currentPage =res.data.data.current
            }).catch(error=>{
                console.log(error.data)
            })
        },
        components: {
            ElMenu,
            ElSubMenu,
            ElMenuItem,
            ElRow,
            ElCol,
            ElCard,
            ElButton,
            Header
        }
    });
</script>

<style scoped>
    .container {
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 20px;
    }
    .menu {
        margin-bottom: 20px;
    }
    .submenu-popper {
        z-index: 999;
    }
    .card-footer {
        text-align: right;
    }
</style>
