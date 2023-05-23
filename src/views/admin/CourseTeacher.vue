<template>
    <div class="file-list">
        <!-- 上部分盒子 -->
        <div class="file-list__header">
            <el-form :model="searchForm" inline>
                <el-form-item label="领域">
                    <el-input v-model.trim="searchForm.domain" placeholder="请输入领域"></el-input>
                </el-form-item>
                <el-form-item label="方向">
                    <el-input v-model.trim="searchForm.direction" placeholder="请输入方向"></el-input>
                </el-form-item>
                <el-form-item label="题目">
                    <el-input v-model.trim="searchForm.title" placeholder="请输入题目"></el-input>
                </el-form-item>
                <el-form-item v-if="false" label="老师">
                    <el-input v-model.trim="searchForm.teacher" placeholder="请输入授课老师"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择">
                        <el-option label="已上线" value="1" />
                        <el-option label="未上线" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 下部分盒子 -->
        <el-table :data="fileList" border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="title" label="题目"></el-table-column>
            <el-table-column v-if=false prop="id" label="id"></el-table-column>
            <el-table-column prop="domain" label="领域"></el-table-column>
            <el-table-column prop="direction" label="方向"></el-table-column>
            <el-table-column prop="userName" label="授课老师"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <span :class="getStatusClass(scope.row.status)"></span>
                    <span> {{getStatusText(scope.row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="date" label="开课日期"></el-table-column>
            <el-table-column  label="操作" width="240">
                <template v-slot:default="scope">
                    <el-button  @click="query(scope.row.id)">查看课程</el-button>
                    <el-button type="primary" @click="edit(scope.row.id)" >编辑大纲</el-button>
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
    import {course} from '@/api/axios'
    import service from "@/api";
    import user from "@/api/axios/user";

    export default {
        name:"CourseManage",
        components: {
            [ElForm.name]: ElForm,
            [ElFormItem.name]: ElFormItem,
            [ElInput.name]: ElInput,
            [ElSelect.name]: ElSelect,
            [ElOption.name]: ElOption,
            [ElRadioGroup.name]: ElRadioGroup,
            [ElRadio.name]: ElRadio,
            [ElButton.name]: ElButton,
            [ElTable.name]: ElTable,
            [ElTableColumn.name]: ElTableColumn,
            [ElTag.name]: ElTag
        },
        data() {
            return {
                dialogFormVisible: false,
                form:{
                    name:'',
                    typeOne:'',
                    teacher:'',
                    teacher1:'',
                    teacher2:''
                },
                options:[],
                optionsTeacher:[],

                searchForm: {
                    domain: '',
                    direction: '',
                    title: '',
                    teacher: '',
                    status:undefined,
                    currentPage:1,
                    pages:100
                },
                fileList: []
            }
        },

        methods: {
            handleCurrentChange(val){
                this.form.currentPage = val
                course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length ; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error)
                })

            },
            getCourseQueryDTO(){
                const courseQueryDTO = {
                    current:this.searchForm.currentPage,
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    typeOne:this.searchForm.domain,
                    typeTwo:this.searchForm.direction,
                    title:this.searchForm.title,
                    teacher:this.searchForm.teacher,
                    status:this.searchForm.status
                }
                return courseQueryDTO
            },
            // 根据状态值获取对应的 class 名称
            getStatusClass(status) {
                switch (status) {
                    case 0:
                        return 'status-unpublished';
                    case 1:
                        return 'status-published';
                    default:
                        return '';
                }
            },
            // 根据状态值获取对应的状态文本
            getStatusText(status) {
                switch (status) {
                    case 0:
                        return '未上线';
                    case 1:
                        return '已上线';
                    default:
                        return '';
                }
            },
            // 搜索课程
            async handleSearch() {
                try {
                    const res = await course.queryAllCourse(this.getCourseQueryDTO())
                    console.log(res.data)
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length ; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                } catch (error) {
                    console.log(error.data)
                }
            },
            // 处理重置
            handleReset() {
                this.searchForm.domain = ''
                this.searchForm.direction = ''
                this.searchForm.title = ''
                this.searchForm.type = ''
            },
            // 判断状态标签类型
            statusTagType(status) {
                return status === 'published' ? 'success' : 'warning'
            },
            query(id){
                this.$router.push({
                    name:"videoPlayPage",
                    query:{
                        id:id
                    }
                })
            },
            edit(id){  //编辑大纲
                this.$router.push({
                    name:"editOutline",
                    query:{
                        id:id
                    }
                })
            }
        },
        beforeMount() {
            course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[];
                this.fileList=[]
                for (var i = 0; i < arr.length ; i++) {
                    this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                }
                this.searchForm.pages=res.data.data.pages
                this.searchForm.currentPage = res.data.data.current
            }).catch(error=>{
                console.log( error )
            })
        }
    }
</script>

<style scoped>
    .file-list__header{

    }
</style>