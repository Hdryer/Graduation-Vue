<template>
    <div class="file-list">
        <!-- 上部分盒子 -->
        <div class="file-list__header">
            <el-form :model="searchForm" inline>
                <el-form-item label="试卷ID">
                    <el-input v-model="searchForm.paperId" placeholder="请输入ID"></el-input>
                </el-form-item>
                <el-form-item label="课程名字">
                    <el-input v-model="searchForm.courseName" placeholder="请输入课程"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 下部分盒子 -->
        <el-table :data="fileList" size ="large" border style="width: 100%">
            <el-table-column prop="id"  label="ID"></el-table-column>
            <el-table-column prop="paperName" label="名称" width="300"></el-table-column>
            <el-table-column prop="courseName" label="所属课程" width="300"></el-table-column>
            <el-table-column prop="num" label="题量" ></el-table-column>
            <el-table-column prop="time" label="时长" ></el-table-column>
            <el-table-column prop="score" label="总分" ></el-table-column>
            <el-table-column prop="creatorName" label="出卷者"></el-table-column>
            <el-table-column  label="操作" width="250">
                <template v-slot:default="scope">
                    <el-button size = "middle"  type="primary" @click="edit(scope.row.id)" >编辑</el-button>
                    <el-popconfirm title="确认删除吗" confirm-button-text="是" cancel-button-text="否"  hide-after=10 @confirm="delCourse(scope.row.id)" hide-icon=true>
                        <template #reference>
                            <el-button  size = "middle" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                :page-count="searchForm.pages"
                :current-page="searchForm.currentPage"
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange" hide-on-single-page />
    </div>
</template>

<script>
    import { ref } from 'vue'

    import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElTable, ElTableColumn, ElTag } from 'element-plus'
    import {course, exam} from '@/api/axios'
    import service from "@/api";
    import user from "@/api/axios/user";

    export default {
        name:"paperManege",
        data() {
            return {
                searchForm: {
                    paperId:"",
                    courseName:"",
                    currentPage:1,
                    pages:1,
                },
                fileList: [],
            }
        },

        methods: {
            delCourse(id){  //删除课程
                exam.delPaper({id:id}).then(res=>{
                    if (res.data.code==200){
                        ElMessage({
                            message: res.data.message,
                            type: 'success',
                        })
                    }
                    this.handleSearch()
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            handleCurrentChange(val){

            },
            // 搜索课程
            handleSearch() {
                exam.queyAllPaper(this.getQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length; i++) {
                        this.fileList.push({id:arr[i].id,paperName:arr[i].name,courseName:arr[i].courseName,time:arr[i].time,score:arr[i].score,num:arr[i].num,creatorName:arr[i].creatorName})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            // 处理重置
            handleReset() {
                this.searchForm.paperId = ''
                this.searchForm.courseName = ''

            },
            edit(id){
                this.$router.push({
                    name:'paper',
                    query:{
                        id:id
                    }
                })
            },
            getQueryDTO(){
                const queryDTO={
                    paperId:this.searchForm.paperId,
                    courseName:this.searchForm.courseName,
                    paperName:"",
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    current:this.searchForm.currentPage,
                }
                return queryDTO
            },
        },
        beforeMount() {
            exam.queryAllPaper(this.getQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[];
                console.log(arr)
                this.fileList=[]
                for (var i = 0; i < arr.length; i++) {
                    this.fileList.push({id:arr[i].id,paperName:arr[i].name,courseName:arr[i].courseName,time:arr[i].time,score:arr[i].score,num:arr[i].num,creatorName:arr[i].creatorName})
                }
                this.searchForm.pages=res.data.data.pages
                this.searchForm.currentPage =res.data.data.current
            }).catch(error=>{
                console.log(error.data)
            })
        }
    }
</script>

<style scoped>
    .file-list__header{

    }

    .status-unpublished {
        color: #f89b9b; /* 设置未发布状态下文本颜色为灰色 */
    }

    .status-published {
        color: green; /* 设置已上线状态下文本颜色为绿色 */
    }
</style>