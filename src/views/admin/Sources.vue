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
                <el-form-item label="类型">
                    <el-select v-model="searchForm.type" placeholder="请选择">
                        <el-option label="视频" value=".mp4" />
                        <el-option label="PDF文档" value=".pdf" />
                        <el-option label="PPT" value=".ppt" />
                        <el-option label="Word文档" value=".docx" />
                        <el-option label="图片" value=".jpg" />
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
            <el-table-column prop="domain" label="领域"></el-table-column>
            <el-table-column prop="direction" label="方向"></el-table-column>
            <el-table-column prop="title" label="题目"></el-table-column>
            <el-table-column v-if="false" prop="fileName" label="文件名"></el-table-column>
            <el-table-column v-if="false" prop="id" label="id"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="userName" label="上传者"></el-table-column>
            <el-table-column prop="date" sortable label="上传日期"></el-table-column>
            <el-table-column  label="操作">
        <!--        <template v-slot:default="scope">
                    <label style="color: black; cursor: pointer" @click="query(scope.row.fileName,scope.row.type)">查看资源</label>  |
                    <label style="color: #f15858;cursor: pointer" @click="isDelete(scope.row.id)">删除</label>
                </template>-->
                <template v-slot:default="scope">
                    <el-button type="primary" @click="query(scope.row.fileName,scope.row.type)">查看</el-button>
                    <el-popconfirm title="确认删除吗" confirm-button-text="是" cancel-button-text="否"  hide-after=10 @confirm="delSources(scope.row.id)" hide-icon=true>
                        <template #reference>
                            <el-button type="danger">删除</el-button>
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
                @current-change="handleCurrentChange"  hide-on-single-page/>
    </div>
</template>

<script>
    import { ref } from 'vue'

    import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElTable, ElTableColumn, ElTag } from 'element-plus'
    import {course,sources,user} from '@/api/axios'
    import service from "@/api";

    export default {
        name:"sources",
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
                searchForm: {
                    domain: '',
                    direction: '',
                    title: '',
                    type: '',
                    currentPage:1,
                    pages:100
                },
                fileList: []
            }
        },
        methods: {
            handleCurrentChange(val){  //分页切换方法
                this.searchForm.currentPage = val
                sources.queryAllSources(this.getSourcesQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    console.log(jsonData)
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, fileName:arr[i].fileName, title:arr[i].title,type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            getSourcesQueryDTO(){
                const sourcesQueryDTO = {
                    current:this.searchForm.currentPage,
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    typeOne:this.searchForm.domain,
                    typeTwo:this.searchForm.direction,
                    title:this.searchForm.title,
                    type:this.searchForm.type
                }
                return sourcesQueryDTO
            },
            // 处理搜索
             handleSearch() {
                // 这里可以调用接口请求数据，并把结果赋值给 this.fileList
                sources.queryAllSources(this.getSourcesQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    console.log(jsonData)
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, fileName:arr[i].fileName, title:arr[i].title,type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })

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
            query(fileName,type){
                if (type==".mp4"){
                    const url = "http://localhost:8080/api/course/video/play1?fileName="+fileName
                    window.open(url,fileName)
                }else {
                    console.log(fileName)
                    var name =encodeURI(encodeURI(fileName));
                    const urls = "http://localhost:8080/api/file/downLoad?fileName="+name
                    window.open(urls,fileName)
                }
            },
            delSources(id){
                console.log(id)
                sources.delSources({id:id}).then(res=>{
                    if (res.data.code==200) {
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        })
                        sources.queryAllSources(this.getSourcesQueryDTO()).then(res=>{
                            const jsonData = res.data.data.records
                            const arr =Array.isArray(jsonData)?jsonData:[];
                            this.fileList=[]
                            for (var i = 0; i < arr.length; i++) {
                                this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, fileName:arr[i].fileName, title:arr[i].title,type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id})
                            }
                            this.searchForm.pages=res.data.data.pages
                            this.searchForm.currentPage =res.data.data.current
                        }).catch(error=>{
                            console.log(error.data)
                        })
                    }else {
                        ElMessage({
                            message: res.data.message,
                            type: 'error',
                        })
                    }
                }).catch(error=>{
                    console.log(error.data)
                })
            }
        },
        beforeMount() {
            sources.queryAllSources(this.getSourcesQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[];
                this.fileList=[]
                for (var i = 0; i < arr.length; i++) {
                    this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, fileName:arr[i].fileName, title:arr[i].title,type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id})
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
</style>